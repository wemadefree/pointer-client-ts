export interface IEntityAssociation {
    addRowRels?: IEntityAssociationRowRel[];
    delRowRels?: IEntityAssociationRowRel[];
}

export interface IEntityAssociationRowRel {
    etyp: string;
    erid: string;
    rtyp: string;
}