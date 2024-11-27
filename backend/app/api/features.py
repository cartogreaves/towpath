# app/api/features.py
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db

router = APIRouter()

@router.get("/mvt/canals/{z}/{x}/{y}")
async def get_canal_tiles(z: int, x: int, y: int, db: Session = Depends(get_db)):
    query = text("""
        WITH bounds AS (
            SELECT ST_TileEnvelope(:z, :x, :y) AS bbox
        ),
        mvtgeom AS (
            SELECT ST_AsMVTGeom(
                ST_Transform(geom, 3857),  
                bounds.bbox,
                extent => 4096,
                buffer => 256
            ) AS geom,
            name,
            region,
            sap_canal_code,
            sap_nav_status
            FROM features.canals, bounds
            WHERE ST_Intersects(ST_Transform(geom, 3857), bounds.bbox)
        )
        SELECT ST_AsMVT(mvtgeom.*, 'canals', 4096) AS mvt
        FROM mvtgeom;
    """)
    
    result = db.execute(query, {"z": z, "x": x, "y": y}).scalar()
    if not result:
        return Response(content=b'', media_type="application/x-protobuf")
    return Response(content=bytes(result), media_type="application/x-protobuf")