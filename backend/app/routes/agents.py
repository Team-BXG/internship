from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import schemas, models

router = APIRouter(prefix="/api/agents", tags=["agents"])

@router.get("", response_model=List[schemas.AgentResponse])
def get_agents(db: Session = Depends(get_db)):
    agents = db.query(models.Agent).order_by(models.Agent.created_at.desc()).all()
    results = []
    for agent in agents:
        agent_dict = agent.__dict__.copy()
        agent_dict['zone_name'] = agent.zone.name if agent.zone else None
        results.append(agent_dict)
    return results

@router.post("", response_model=schemas.AgentResponse)
def create_agent(agent: schemas.AgentCreate, db: Session = Depends(get_db)):
    db_agent = models.Agent(
        name=agent.name,
        email=agent.email,
        phone=agent.phone,
        national_id=agent.national_id,
        zone_id=agent.zone_id,
        status='Active',
        performance=0,
        served=0
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    
    # Reload with zone info for response
    db_agent = db.query(models.Agent).filter(models.Agent.id == db_agent.id).first()
    agent_dict = db_agent.__dict__.copy()
    agent_dict['zone_name'] = db_agent.zone.name if db_agent.zone else None
    
    return agent_dict
