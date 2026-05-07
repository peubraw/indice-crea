# pyright: reportAny=false, reportUnknownVariableType=false, reportUnknownArgumentType=false, reportUnusedCallResult=false

import logging
import os
import sys
from pathlib import Path
from typing import TypedDict

from sqlalchemy import create_engine
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.services.db import Base, DATABASE_URL, StateMetricInput, StateScore, build_metric_input_seed, build_state_score_seed

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

SYNC_DATABASE_URL = os.getenv("DATABASE_URL", DATABASE_URL)
engine = create_engine(SYNC_DATABASE_URL)


class PipelineScoreRow(TypedDict):
    uf: str
    name: str
    score_total: float
    score_mercado: float
    score_formacao: float
    score_capacidade: float
    score_obras: float | None
    score_empregabilidade: float | None
    score_fiscalizacao: float | None
    rank_total: int
    methodology_version: str
    reference_year: int


def print_summary(score_rows: list[PipelineScoreRow]) -> None:
    print("UF  Estado                    Total  Mercado  Formação  Capacidade  Rank")
    print("--  ------------------------  -----  -------  --------  ----------  ----")
    for row in score_rows:
        print(
            f"{row['uf']:<2}  {row['name'][:24]:<24}  {row['score_total']:>5.2f}  {row['score_mercado']:>7.2f}  {row['score_formacao']:>8.2f}  {row['score_capacidade']:>10.2f}  {row['rank_total']:>4}"
        )


def run() -> None:
    log.info("Iniciando pipeline do Índice CREA...")
    metric_rows = build_metric_input_seed()
    score_rows = build_state_score_seed(metric_rows)

    with engine.begin() as connection:
        Base.metadata.drop_all(connection)
        Base.metadata.create_all(connection)

    with Session(engine) as session:
        session.execute(insert(StateMetricInput), metric_rows)

        for row in score_rows:
            stmt = insert(StateScore).values(**row)
            stmt = stmt.on_conflict_do_update(
                index_elements=[StateScore.uf],
                set_={
                    "name": stmt.excluded.name,
                    "score_total": stmt.excluded.score_total,
                    "score_mercado": stmt.excluded.score_mercado,
                    "score_formacao": stmt.excluded.score_formacao,
                    "score_capacidade": stmt.excluded.score_capacidade,
                    "score_obras": stmt.excluded.score_obras,
                    "score_empregabilidade": stmt.excluded.score_empregabilidade,
                    "score_fiscalizacao": stmt.excluded.score_fiscalizacao,
                    "rank_total": stmt.excluded.rank_total,
                    "methodology_version": stmt.excluded.methodology_version,
                    "reference_year": stmt.excluded.reference_year,
                },
            )
            _ = session.execute(stmt)

        session.commit()

    log.info("Tabelas recriadas e dados carregados com sucesso.")
    log.info("%s métricas auditáveis inseridas.", len(metric_rows))
    log.info("%s scores estaduais calculados.", len(score_rows))
    print_summary(score_rows)


if __name__ == "__main__":
    run()
