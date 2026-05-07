# pyright: reportArgumentType=false, reportGeneralTypeIssues=false, reportUnknownVariableType=false, reportUnknownMemberType=false, reportUnknownArgumentType=false, reportUnusedCallResult=false

import csv
import io

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import select

from backend.services.db import AsyncSessionLocal, DIMENSION_DEFINITIONS, StateMetricInput

router = APIRouter()


def serialize_metric(row: StateMetricInput):
    return {
        "id": row.id,
        "uf": row.uf,
        "dimension": row.dimension,
        "dimension_label": DIMENSION_DEFINITIONS[row.dimension]["label"],
        "metric_key": row.metric_key,
        "raw_value": round(float(row.raw_value), 2),
        "normalized_value": round(float(row.normalized_value), 2),
        "source_name": row.source_name,
        "source_url": row.source_url,
        "reference_period": row.reference_period,
        "is_estimated": bool(row.is_estimated),
    }


@router.get("/export/csv")
async def export_metrics_csv():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(StateMetricInput).order_by(
                StateMetricInput.uf.asc(),
                StateMetricInput.dimension.asc(),
                StateMetricInput.metric_key.asc(),
            )
        )
        rows = result.scalars().all()

    output = io.StringIO()
    writer = csv.DictWriter(
        output,
        fieldnames=[
            "id",
            "uf",
            "dimension",
            "dimension_label",
            "metric_key",
            "raw_value",
            "normalized_value",
            "source_name",
            "source_url",
            "reference_period",
            "is_estimated",
        ],
    )
    writer.writeheader()
    for row in rows:
        writer.writerow(serialize_metric(row))

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": 'attachment; filename="indice-crea-metricas.csv"'},
    )


@router.get("/{uf}")
async def get_state_metrics(uf: str):
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(StateMetricInput)
            .where(StateMetricInput.uf == uf.upper())
            .order_by(StateMetricInput.dimension.asc(), StateMetricInput.metric_key.asc())
        )
        rows = result.scalars().all()

    if not rows:
        raise HTTPException(status_code=404, detail="Métricas do estado não encontradas")

    return {
        "uf": uf.upper(),
        "total_metrics": len(rows),
        "items": [serialize_metric(row) for row in rows],
    }
