// This file is copied from the pointer project. Keep it updated with the pointer project.

export interface IEntityMeta {
    id: string;
    name: string;
    icon: string;
    isGroup?: boolean;
    groupConfig?: {
      entityTypesAllowedAsMembers?: string[];
      isExclusive?: boolean;
    },
    apiKind: string;
    modelId: string;
    apiId: string;
    apiDriverId?: 'genericEntityListBeta1' | 'genericEntityProxyBeta1';
    apiDriverConfig?: {
      allowBulkCreate?: boolean;
      noCreate?: boolean;
      noUpdate?: boolean;
      noAssociations?: boolean;
      getScopes?: string[];
      listScopes?: string[];
      createScopes?: string[];
      updateScopes?: string[];
    },
    odmDriverId?: 'genericEntityOdmBeta1';
    odmDriverConfig?: {},
    initialSeqNoConfig?: InitialEntitySeqNoMeta;
    createNewDialogWidgetId?: string;
    viewRowDialogWidgetId?: string;
    allowedFilterKeys?: string[];
    properties: IEntityPropertyMeta[];
    propertyChannels?: string[]; // Property channels can be used to define a different schema and subset of props for external use
    uiViews: NodeJS.Dict<any>[]; // TODO: type interface
    uiWidgets: NodeJS.Dict<any>[]; // TODO: type interface
    isElasticSearchAvailable?: boolean;
    _todoEntityInternals?: any;
    _todoAllEntities?: () => IEntityMeta[];
    folderNameGenerator?: (row: any) => string;
    authScope?: {
      list: string[];
      get: string[];
      patch: string[];
      create: string[];
      propertyChannels: string[];
    };
  }
  
  export interface IEntityPropertyMeta {
    id: string;
    name?: string;
    dataTypeId?: string;
    /** jsonBaseType is assigned automatically based on dataTypeId */
    jsonBaseType?: 'string' | 'number' | 'object' | 'array' | 'boolean';
    /** jsonBaseType is assigned automatically based on dataTypeId */
    bsonBaseType?: 'double' | 'decimal' | 'string' | 'object' | 'array' | 'objectId' | 'bool' | 'date';
    foreignKey?: IEntityForeignKey;
    formInputType?: string;
    formInputConfig?: any;
    tableColumnFormatter?: string;
    tableColumnConfig?: any;
    defaultValue?: string | number | boolean | null | undefined;
    enumOptions?: IEntityPropertyEnum[];
    subdocEntityType?: string;
    freadonly?: boolean;
    isRequired?: boolean;
    isImmutable?: boolean;
    isUniqueIndex?: boolean;
    dedicatedIndex?: boolean;
    // isGeoIndex?: boolean;
    isCopyIgnored?: boolean;
    computedProp?: {
      mongoExpression: Record<string, any>;
    },
    channels?: string[];
  }
  
  export interface IEntityForeignKey {
    fkType: 'one2one' | 'one2many';
    foreignEntityType: string;
    foreignPropertyId: string;
    localPropertyId?: string;
    foreignFields: IEntityForeignField[];
    autoRowRels?: IEntityForeignKeyAutoRowRel[];
    alwaysIncludeGet?: boolean;
  }
  
  export interface IEntityForeignKeyAutoRowRel {
    rtyp: string;
    noPush?: boolean;
    noPull?: boolean;
  }
  
  export interface IEntityForeignField {
    src: string;
  
    /*
      The output key name. Can be a path to create objects (Ex customer.no)
    */
    dst: string;
  
    /*
      Store a copy of the value. No join is performed on select
    */
    storeLocal: boolean;
  
    /*
      If true the value can be set to something else on create/patch
    */
    allowLocalOverride: boolean;
  }
  
  export interface IEntityPropertyEnum {
    value: string | number | null;
    label: string;
    behaviors?: string[];
  }
  
  export interface InitialEntitySeqNoMeta {
    seqNoDisable?: boolean;
    seqNoDisableTnx?: boolean;
  
    /** Validation will fail if 'no' is below this value  */
    minValue?: number;
  
    /** Validation will fail if 'no' is above this value */
    maxValue?: number;
  
    /** The number generator will start at this value (defaults to minValue if 0) */
    startValue?: number;
  
    /** The number generator will fail when the next id is above this value. (defaults to maxValue if 0) */
    endValue?: number;
  
    /** Increment the current value by this number (step) */
    incValue?: number;
  
    prefix?: string;
    suffix?: string;
  
    /** Use value of slugify(getPath(row, slugifyPropId)) as no. */
    slugifyEnabled?: boolean;
  
    /** Append a number instead of failing when slug is taken */
    slugifyRescueMax?: number;
  
    /**
     * field path to get no from
     * @default "name"
     */
    slugifyPropId?: string;
  }
  
  export interface ITenantNumSeq extends Required<InitialEntitySeqNoMeta> {
    id: string;
    no: string;
    tenantId: string;
    uniqueGroup: string;
    uniqueGroupType: string;
  }
  