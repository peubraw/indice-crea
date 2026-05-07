# pyright: reportArgumentType=false, reportGeneralTypeIssues=false, reportReturnType=false, reportUnknownVariableType=false, reportUnknownMemberType=false, reportUnknownArgumentType=false, reportUnknownParameterType=false, reportCallInDefaultInitializer=false

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import select

from backend.services.db import AsyncSessionLocal, StateScore, SUPPORTED_RANKING_DIMENSIONS

router = APIRouter()


def get_dimension_column(dimension: str):
    column_map = {
        "total": StateScore.score_total,
        "mercado": StateScore.score_mercado,
        "formacao": StateScore.score_formacao,
        "capacidade": StateScore.score_capacidade,
    }
    return column_map[dimension]


def get_dimension_score(state: StateScore, dimension: str) -> float:
    score_map = {
        "total": state.score_total,
        "mercado": state.score_mercado,
        "formacao": state.score_formacao,
        "capacidade": state.score_capacidade,
    }
    return score_map[dimension]


@router.get("")
async def get_ranking(dimension: str = Query("total")):
    if dimension not in SUPPORTED_RANKING_DIMENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Dimensão inválida. Use: {', '.join(SUPPORTED_RANKING_DIMENSIONS)}",
        )

    column = get_dimension_column(dimension)

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(StateScore).order_by(column.desc(), StateScore.name.asc())
        )
        rows = result.scalars().all()

    return [
        {
            "rank": index,
            "uf": row.uf,
            "name": row.name,
            "dimension": dimension,
            "score": round(float(get_dimension_score(row, dimension)), 2),
        }
        for index, row in enumerate(rows, start=1)
    ]
