# pyright: reportArgumentType=false, reportGeneralTypeIssues=false, reportReturnType=false, reportUnknownVariableType=false, reportUnknownMemberType=false, reportUnknownArgumentType=false

from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from backend.services.db import ACTIVE_DIMENSION_KEYS, AsyncSessionLocal, DIMENSION_DEFINITIONS, StateScore

router = APIRouter()


def get_dimension_score(state: StateScore, key: str) -> float | None:
    score_map = {
        "mercado": state.score_mercado,
        "formacao": state.score_formacao,
        "capacidade": state.score_capacidade,
        "obras": state.score_obras,
        "empregabilidade": state.score_empregabilidade,
        "fiscalizacao": state.score_fiscalizacao,
    }
    return score_map[key]


def serialize_dimensions(state: StateScore):
    return {
        key: {
            "label": DIMENSION_DEFINITIONS[key]["label"],
            "score": None if get_dimension_score(state, key) is None else round(float(get_dimension_score(state, key) or 0), 2),
        }
        for key in DIMENSION_DEFINITIONS
    }


def serialize_state(state: StateScore):
    return {
        "uf": state.uf,
        "name": state.name,
        "score_total": round(float(state.score_total or 0), 2),
        "rank": state.rank_total,
        "reference_year": state.reference_year,
        "methodology_version": state.methodology_version,
        "dimensions": serialize_dimensions(state),
    }


@router.get("")
async def list_states():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(StateScore).order_by(StateScore.rank_total))
        return [serialize_state(row) for row in result.scalars().all()]


@router.get("/brazil")
async def get_brazil_summary():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(StateScore).order_by(StateScore.rank_total))
        rows = result.scalars().all()

    if not rows:
        return {
            "uf": "BR",
            "name": "Brasil",
            "score_total": 0.0,
            "total_states": 0,
            "dimensions": {},
        }

    dimensions = {}
    for key in ACTIVE_DIMENSION_KEYS:
        values = [float(getattr(row, f"score_{key}") or 0) for row in rows]
        dimensions[key] = {
            "label": DIMENSION_DEFINITIONS[key]["label"],
            "score": round(sum(values) / len(values), 2),
        }

    return {
        "uf": "BR",
        "name": "Brasil",
        "score_total": round(sum(float(row.score_total or 0) for row in rows) / len(rows), 2),
        "total_states": len(rows),
        "reference_year": rows[0].reference_year,
        "methodology_version": rows[0].methodology_version,
        "dimensions": dimensions,
    }


@router.get("/{uf}")
async def get_state(uf: str):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(StateScore).where(StateScore.uf == uf.upper()))
        state = result.scalar_one_or_none()

    if not state:
        raise HTTPException(status_code=404, detail="Estado não encontrado")

    return serialize_state(state)
