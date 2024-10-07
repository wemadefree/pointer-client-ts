export interface IAvailableEntities {
    [key: string]: IAvailableEntity;
}

export interface IAvailableEntity {
    id: string;
    apiId: string;
    properties: IAvailableEntityProperties[];
}

export interface IAvailableEntityProperties {
    id: string;
    name: string;
    dataTypeId: string;
    jsonBaseType: string;
    isRequired: boolean;
    foreignKey?: IEntityForeignKey;
    defaultValue?: string | number | boolean | null | undefined;
    enumOptions?: IEntityPropertyEnum[];
}

export interface IEntityForeignKey {
    foreignEntityType: string;
    foreignPropertyId: string;
    alwaysIncludeGet: boolean;
    foreignFields: IEntityForeignFields[];
}

export interface IEntityForeignFields {
    src: string;
    dst: string;
}

export interface IEntityPropertyEnum {
    value: string | number | null;
    label: string;
    behaviors?: string[];
}