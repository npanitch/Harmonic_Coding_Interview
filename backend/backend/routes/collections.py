import uuid

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.db import database
from backend.routes.companies import (
    CompanyBatchOutput,
    fetch_companies_with_liked,
)

router = APIRouter(
    prefix="/collections",
    tags=["collections"],
)


class CompanyCollectionMetadata(BaseModel):
    id: uuid.UUID
    collection_name: str


class CompanyCollectionOutput(CompanyBatchOutput, CompanyCollectionMetadata):
    pass


@router.get("", response_model=list[CompanyCollectionMetadata])
def get_all_collection_metadata(
    db: Session = Depends(database.get_db),
):
    collections = db.query(database.CompanyCollection).all()

    return [
        CompanyCollectionMetadata(
            id=collection.id,
            collection_name=collection.collection_name,
        )
        for collection in collections
    ]

@router.get("/ids/{collection_id}", response_model=list[int])
def get_collection_companies_by_id(
    collection_id: uuid.UUID,
    db: Session = Depends(database.get_db),
):
    whole_collection = (
    db.query(database.CompanyCollectionAssociation, database.Company)
    .join(database.Company)
    .filter(database.CompanyCollectionAssociation.collection_id == collection_id).all())
    ids = [company.id for _, company in whole_collection]
    return ids

@router.get("/{collection_id}", response_model=CompanyCollectionOutput)
def get_company_collection_by_id(
    collection_id: uuid.UUID,
    offset: int = Query(
        0, description="The number of items to skip from the beginning"
    ),
    limit: int = Query(10, description="The number of items to fetch"),
    db: Session = Depends(database.get_db),
):
    query = (
        db.query(database.CompanyCollectionAssociation, database.Company)
        .join(database.Company)
        .filter(database.CompanyCollectionAssociation.collection_id == collection_id)
    )

    total_count = query.with_entities(func.count()).scalar()

    results = query.offset(offset).limit(limit).all()
    companies = fetch_companies_with_liked(db, [company.id for _, company in results])

    return CompanyCollectionOutput(
        id=collection_id,
        collection_name=db.query(database.CompanyCollection)
        .get(collection_id)
        .collection_name,
        companies=companies,
        total=total_count,
    )
 
""" This function takes a collection ID and a list of company ids and 
creates CompanyCollectionAssociations between the collection and all the companies in the list. """
@router.put("/{collection_id}", response_model=int)
def connect_company_to_collection(
    collection_id: uuid.UUID,
    ids: list[int],
    db: Session = Depends(database.get_db),
):
    for id in ids:
        query = (
            db.query(database.CompanyCollectionAssociation, database.Company)
            .join(database.Company)
            .filter(database.CompanyCollectionAssociation.collection_id == collection_id)
            .filter(database.Company.id == id).first()
        )
        if query is None:
            new_connection=database.CompanyCollectionAssociation(
                company_id=id,
                collection_id=collection_id
            )
            db.add(new_connection)
    
    db.commit()
    
    return 1

@router.put("/new_collection/{collection_name}", response_model=CompanyCollectionMetadata)
def create_collection(
    collection_name: str, 
    db: Session = Depends(database.get_db),
):
    new_collection = database.CompanyCollection(
        collection_name = collection_name,
    )
    db.add(new_collection)
    db.commit()
    return new_collection
