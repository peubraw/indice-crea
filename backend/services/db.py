# pyright: reportAny=false, reportUnannotatedClassAttribute=false

import os
from collections import defaultdict
from datetime import datetime
from typing import TypedDict

from sqlalchemy import Boolean, DateTime, Float, Integer, String, func, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://indicecrea:indicecrea2026@localhost:5432/indicecrea",
)
ASYNC_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(ASYNC_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

REFERENCE_YEAR = 2024
METHODOLOGY_VERSION = "1.0"


class Base(DeclarativeBase):
    pass


class StateReference(TypedDict):
    uf: str
    name: str
    population: int
    professionals_active: int
    courses_count: int
    institutions_count: int
    grad_programs_count: int
    patents_count: int


class MetricSource(TypedDict):
    source_name: str
    source_url: str
    reference_period: str
    is_estimated: bool


class MetricInputSeed(TypedDict):
    uf: str
    dimension: str
    metric_key: str
    raw_value: float
    normalized_value: float
    source_name: str
    source_url: str
    reference_period: str
    is_estimated: bool


class StateScoreSeed(TypedDict):
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


DIMENSION_DEFINITIONS = {
    "mercado": {
        "label": "Mercado Profissional",
        "active": True,
        "metric_keys": ("professionals_per_100k",),
    },
    "formacao": {
        "label": "Formação Técnica",
        "active": True,
        "metric_keys": ("courses_count", "institutions_count"),
    },
    "capacidade": {
        "label": "Capacidade Técnica",
        "active": True,
        "metric_keys": ("patents_count", "grad_programs_count"),
    },
    "obras": {
        "label": "Obras e Projetos",
        "active": False,
        "metric_keys": (),
    },
    "empregabilidade": {
        "label": "Empregabilidade",
        "active": False,
        "metric_keys": (),
    },
    "fiscalizacao": {
        "label": "Fiscalização",
        "active": False,
        "metric_keys": (),
    },
}

ACTIVE_DIMENSION_KEYS = tuple(
    key for key, config in DIMENSION_DEFINITIONS.items() if config["active"]
)
SUPPORTED_RANKING_DIMENSIONS = ("total", *ACTIVE_DIMENSION_KEYS)

METRIC_SOURCES: dict[str, MetricSource] = {
    "professionals_per_100k": {
        "source_name": "CONFEA / IBGE - profissionais ativos por 100 mil habitantes",
        "source_url": "https://relatorio.confea.org.br",
        "reference_period": "2024",
        "is_estimated": True,
    },
    "courses_count": {
        "source_name": "e-MEC - cursos de engenharia, agronomia e geociências",
        "source_url": "https://emec.mec.gov.br",
        "reference_period": "2024",
        "is_estimated": True,
    },
    "institutions_count": {
        "source_name": "e-MEC - instituições com oferta nas áreas CREA/CONFEA",
        "source_url": "https://emec.mec.gov.br",
        "reference_period": "2024",
        "is_estimated": True,
    },
    "patents_count": {
        "source_name": "INPI - depósitos e concessões com aderência tecnológica às áreas CREA/CONFEA",
        "source_url": "https://www.inpi.gov.br",
        "reference_period": "2024",
        "is_estimated": True,
    },
    "grad_programs_count": {
        "source_name": "e-MEC - programas stricto sensu com aderência técnica nas áreas CREA/CONFEA",
        "source_url": "https://emec.mec.gov.br",
        "reference_period": "2024",
        "is_estimated": True,
    },
}

STATE_REFERENCE_DATA: list[StateReference] = [
    {"uf": "AC", "name": "Acre", "population": 906876, "professionals_active": 4000, "courses_count": 28, "institutions_count": 6, "grad_programs_count": 5, "patents_count": 22},
    {"uf": "AL", "name": "Alagoas", "population": 3316886, "professionals_active": 13000, "courses_count": 70, "institutions_count": 14, "grad_programs_count": 14, "patents_count": 55},
    {"uf": "AP", "name": "Amapá", "population": 802837, "professionals_active": 3500, "courses_count": 24, "institutions_count": 5, "grad_programs_count": 4, "patents_count": 18},
    {"uf": "AM", "name": "Amazonas", "population": 4281209, "professionals_active": 18000, "courses_count": 78, "institutions_count": 13, "grad_programs_count": 18, "patents_count": 90},
    {"uf": "BA", "name": "Bahia", "population": 14850513, "professionals_active": 65000, "courses_count": 230, "institutions_count": 40, "grad_programs_count": 48, "patents_count": 250},
    {"uf": "CE", "name": "Ceará", "population": 9233656, "professionals_active": 46000, "courses_count": 170, "institutions_count": 28, "grad_programs_count": 34, "patents_count": 180},
    {"uf": "DF", "name": "Distrito Federal", "population": 3094325, "professionals_active": 36000, "courses_count": 95, "institutions_count": 20, "grad_programs_count": 36, "patents_count": 210},
    {"uf": "ES", "name": "Espírito Santo", "population": 4108508, "professionals_active": 25000, "courses_count": 95, "institutions_count": 16, "grad_programs_count": 22, "patents_count": 140},
    {"uf": "GO", "name": "Goiás", "population": 7350483, "professionals_active": 43000, "courses_count": 150, "institutions_count": 26, "grad_programs_count": 28, "patents_count": 170},
    {"uf": "MA", "name": "Maranhão", "population": 7010960, "professionals_active": 23000, "courses_count": 95, "institutions_count": 18, "grad_programs_count": 15, "patents_count": 70},
    {"uf": "MG", "name": "Minas Gerais", "population": 21322691, "professionals_active": 125000, "courses_count": 410, "institutions_count": 72, "grad_programs_count": 92, "patents_count": 560},
    {"uf": "MS", "name": "Mato Grosso do Sul", "population": 2901895, "professionals_active": 21000, "courses_count": 88, "institutions_count": 14, "grad_programs_count": 18, "patents_count": 100},
    {"uf": "MT", "name": "Mato Grosso", "population": 3836199, "professionals_active": 28000, "courses_count": 110, "institutions_count": 18, "grad_programs_count": 20, "patents_count": 130},
    {"uf": "PA", "name": "Pará", "population": 8777124, "professionals_active": 35000, "courses_count": 120, "institutions_count": 22, "grad_programs_count": 24, "patents_count": 115},
    {"uf": "PB", "name": "Paraíba", "population": 4145040, "professionals_active": 20000, "courses_count": 82, "institutions_count": 16, "grad_programs_count": 18, "patents_count": 95},
    {"uf": "PE", "name": "Pernambuco", "population": 9539029, "professionals_active": 49000, "courses_count": 165, "institutions_count": 29, "grad_programs_count": 36, "patents_count": 190},
    {"uf": "PI", "name": "Piauí", "population": 3289290, "professionals_active": 13000, "courses_count": 60, "institutions_count": 12, "grad_programs_count": 10, "patents_count": 45},
    {"uf": "PR", "name": "Paraná", "population": 11824665, "professionals_active": 78000, "courses_count": 260, "institutions_count": 45, "grad_programs_count": 60, "patents_count": 360},
    {"uf": "RJ", "name": "Rio de Janeiro", "population": 17219728, "professionals_active": 95000, "courses_count": 280, "institutions_count": 50, "grad_programs_count": 70, "patents_count": 430},
    {"uf": "RN", "name": "Rio Grande do Norte", "population": 3446071, "professionals_active": 19000, "courses_count": 125, "institutions_count": 19, "grad_programs_count": 28, "patents_count": 165},
    {"uf": "RO", "name": "Rondônia", "population": 1746227, "professionals_active": 8000, "courses_count": 42, "institutions_count": 8, "grad_programs_count": 7, "patents_count": 30},
    {"uf": "RR", "name": "Roraima", "population": 716793, "professionals_active": 3000, "courses_count": 18, "institutions_count": 4, "grad_programs_count": 3, "patents_count": 12},
    {"uf": "RS", "name": "Rio Grande do Sul", "population": 11322905, "professionals_active": 75000, "courses_count": 250, "institutions_count": 44, "grad_programs_count": 58, "patents_count": 340},
    {"uf": "SC", "name": "Santa Catarina", "population": 8058441, "professionals_active": 58000, "courses_count": 210, "institutions_count": 36, "grad_programs_count": 44, "patents_count": 260},
    {"uf": "SE", "name": "Sergipe", "population": 2291077, "professionals_active": 10000, "courses_count": 46, "institutions_count": 9, "grad_programs_count": 8, "patents_count": 35},
    {"uf": "SP", "name": "São Paulo", "population": 45973190, "professionals_active": 250000, "courses_count": 680, "institutions_count": 125, "grad_programs_count": 170, "patents_count": 1500},
    {"uf": "TO", "name": "Tocantins", "population": 1607363, "professionals_active": 8000, "courses_count": 36, "institutions_count": 7, "grad_programs_count": 6, "patents_count": 26},
]


class StateScore(Base):
    __tablename__ = "state_scores"

    uf: Mapped[str] = mapped_column(String(2), primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    score_total: Mapped[float] = mapped_column(Float, nullable=False)
    score_mercado: Mapped[float] = mapped_column(Float, nullable=False)
    score_formacao: Mapped[float] = mapped_column(Float, nullable=False)
    score_capacidade: Mapped[float] = mapped_column(Float, nullable=False)
    score_obras: Mapped[float | None] = mapped_column(Float, nullable=True)
    score_empregabilidade: Mapped[float | None] = mapped_column(Float, nullable=True)
    score_fiscalizacao: Mapped[float | None] = mapped_column(Float, nullable=True)
    rank_total: Mapped[int] = mapped_column(Integer, nullable=False)
    methodology_version: Mapped[str] = mapped_column(String(10), default=METHODOLOGY_VERSION)
    reference_year: Mapped[int] = mapped_column(Integer, default=REFERENCE_YEAR)
    source_snapshot_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


class StateMetricInput(Base):
    __tablename__ = "state_metric_inputs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    uf: Mapped[str] = mapped_column(String(2), nullable=False, index=True)
    dimension: Mapped[str] = mapped_column(String(50), nullable=False)
    metric_key: Mapped[str] = mapped_column(String(100), nullable=False)
    raw_value: Mapped[float] = mapped_column(Float, nullable=False)
    normalized_value: Mapped[float] = mapped_column(Float, nullable=False)
    source_name: Mapped[str] = mapped_column(String(200), nullable=False)
    source_url: Mapped[str] = mapped_column(String(500), nullable=False)
    reference_period: Mapped[str] = mapped_column(String(20), nullable=False)
    is_estimated: Mapped[bool] = mapped_column(Boolean, default=False)


def normalize_minmax(value: float, min_value: float, max_value: float) -> float:
    if max_value == min_value:
        return 100.0
    return round(((value - min_value) / (max_value - min_value)) * 100, 2)


def build_metric_input_seed() -> list[MetricInputSeed]:
    metric_rows: list[MetricInputSeed] = []

    for state in STATE_REFERENCE_DATA:
        professionals_per_100k = round(
            (state["professionals_active"] / state["population"]) * 100000,
            2,
        )

        raw_metrics: list[tuple[str, str, float]] = [
            ("mercado", "professionals_per_100k", professionals_per_100k),
            ("formacao", "courses_count", float(state["courses_count"])),
            ("formacao", "institutions_count", float(state["institutions_count"])),
            ("capacidade", "patents_count", float(state["patents_count"])),
            ("capacidade", "grad_programs_count", float(state["grad_programs_count"])),
        ]

        for dimension, metric_key, raw_value in raw_metrics:
            source = METRIC_SOURCES[metric_key]
            metric_rows.append(
                {
                    "uf": state["uf"],
                    "dimension": dimension,
                    "metric_key": metric_key,
                    "raw_value": raw_value,
                    "normalized_value": 0.0,
                    "source_name": source["source_name"],
                    "source_url": source["source_url"],
                    "reference_period": source["reference_period"],
                    "is_estimated": source["is_estimated"],
                }
            )

    values_by_metric: dict[str, list[float]] = defaultdict(list)
    for row in metric_rows:
        values_by_metric[row["metric_key"]].append(row["raw_value"])

    ranges_by_metric = {
        metric_key: (min(values), max(values))
        for metric_key, values in values_by_metric.items()
    }

    for row in metric_rows:
        min_value, max_value = ranges_by_metric[row["metric_key"]]
        row["normalized_value"] = normalize_minmax(row["raw_value"], min_value, max_value)

    return metric_rows


def build_state_score_seed(metric_rows: list[MetricInputSeed]) -> list[StateScoreSeed]:
    state_names = {state["uf"]: state["name"] for state in STATE_REFERENCE_DATA}
    rows_by_state_and_dimension: dict[tuple[str, str], list[MetricInputSeed]] = defaultdict(list)

    for row in metric_rows:
        rows_by_state_and_dimension[(row["uf"], row["dimension"])].append(row)

    score_rows: list[StateScoreSeed] = []
    for state in STATE_REFERENCE_DATA:
        dimension_scores: dict[str, float] = {}
        for dimension_key in ACTIVE_DIMENSION_KEYS:
            dimension_rows = rows_by_state_and_dimension[(state["uf"], dimension_key)]
            dimension_scores[dimension_key] = round(
                sum(item["normalized_value"] for item in dimension_rows) / len(dimension_rows),
                2,
            )

        score_total = round(
            sum(dimension_scores[key] for key in ACTIVE_DIMENSION_KEYS)
            / len(ACTIVE_DIMENSION_KEYS),
            2,
        )

        score_rows.append(
            {
                "uf": state["uf"],
                "name": state_names[state["uf"]],
                "score_total": score_total,
                "score_mercado": dimension_scores["mercado"],
                "score_formacao": dimension_scores["formacao"],
                "score_capacidade": dimension_scores["capacidade"],
                "score_obras": None,
                "score_empregabilidade": None,
                "score_fiscalizacao": None,
                "rank_total": 0,
                "methodology_version": METHODOLOGY_VERSION,
                "reference_year": REFERENCE_YEAR,
            }
        )

    ordered_rows = sorted(
        score_rows,
        key=lambda row: (
            -row["score_total"],
            -row["score_mercado"],
            -row["score_formacao"],
            -row["score_capacidade"],
            row["uf"],
        ),
    )

    for index, row in enumerate(ordered_rows, start=1):
        row["rank_total"] = index

    return ordered_rows


async def seed_data(session: AsyncSession) -> None:
    metric_rows = build_metric_input_seed()
    score_rows = build_state_score_seed(metric_rows)

    session.add_all([StateMetricInput(**row) for row in metric_rows])
    session.add_all([StateScore(**row) for row in score_rows])


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        count = await session.scalar(select(func.count()).select_from(StateScore))
        if not count:
            await seed_data(session)
            await session.commit()
