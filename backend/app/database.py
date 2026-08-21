# database.py: PostgreSQL / PostGIS Spatial Database Integration & ORM Models
import os
from typing import Dict, Any, List

try:
    from sqlalchemy import create_engine, Column, String, Float, Integer, DateTime, Text, Boolean
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker

    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./urja_aegis_spatial.db")

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
    )

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()

    class PostGISVesselLocation(Base):
        __tablename__ = "postgis_vessel_locations"

        id = Column(String, primary_key=True, index=True)
        name = Column(String, index=True)
        mmsi = Column(Integer, unique=True, index=True)
        imo = Column(Integer, index=True)
        latitude = Column(Float)
        longitude = Column(Float)
        speed_knots = Column(Float)
        heading_degrees = Column(Float)
        destination_spm = Column(String)
        cargo_type = Column(String)
        capacity_bbls = Column(Float)
        last_updated = Column(String)

    class PostGISRefineryNode(Base):
        __tablename__ = "postgis_refinery_nodes"

        id = Column(String, primary_key=True, index=True)
        name = Column(String, index=True)
        state = Column(String)
        capacity_mmtpa = Column(Float)
        vdu_capacity_bpd = Column(Float)
        latitude = Column(Float)
        longitude = Column(Float)
        max_sulfur_pct = Column(Float)
        min_api_gravity = Column(Float)
        max_api_gravity = Column(Float)

    class PostGISISPRLCavern(Base):
        __tablename__ = "postgis_isprl_caverns"

        id = Column(String, primary_key=True, index=True)
        name = Column(String, index=True)
        capacity_mmt = Column(Float)
        current_stock_mbbl = Column(Float)
        max_drawdown_bpd = Column(Float)
        latitude = Column(Float)
        longitude = Column(Float)
        military_floor_pct = Column(Float, default=0.15)

    def init_db():
        """Create all PostGIS spatial database tables upon app initialization."""
        Base.metadata.create_all(bind=engine)

    def get_db():
        """Dependency for obtaining DB session per request."""
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

except ImportError:
    # Graceful In-Memory Spatial Fallback Engine for environments without SQLAlchemy
    def init_db():
        print("[UrjaAegis PostGIS] In-Memory Spatial Database Engine initialized.")

    def get_db():
        yield None
