
// Not official or complete in any way!

export interface ISharePointJsonSearchResult {
    ElapsedTime: number;
    PrimaryQueryResult: ISharePointJsonPrimaryQueryResult;
    SecondaryQueryResults: Array<ISharePointJsonSecondaryQueryResults>;
    SpellingSuggestion: string;
    TriggeredRules: Array<any>;
}

export interface ISharePointJsonPrimaryQueryResult {
    CustomResults: Array<any>;
    QueryId: string;
    QueryRuleId: string;
    RefinementResults: any;
    RelevantResults: ISharePointJsonRelevantResults;
    SpecialTermResults: any;
}

export interface ISharePointJsonRelevantResults {
    GroupTemplateId: any;
    ItemTemplateId: any;
    ResultTitle: any;
    ResultTitleUrl: any;
    RowCount: number;
    Table: ISharePointJsonTable;
    TotalRows: number;
    TotalRowsIncludingDuplicates: number;
}

export interface ISharePointJsonTable {
    Rows: Array<ISharePointJsonRow>;
}

export interface ISharePointJsonRow {
    Cells: Array<ISharePointJsonCell>;
}

export interface ISharePointJsonCell {
    Key: string;
    Value: any;
    ValueType: string;
}

export interface ISharePointJsonSecondaryQueryResults {
    RelevantResults: ISharePointJsonRelevantResults;
    SpecialTermResults: ISharePointJsonSpecialTermResults;
}

export interface ISharePointJsonSpecialTermResults {
    Results: Array<ISharePointJsonTermResult>;
}

export interface ISharePointJsonTermResult {
    Title: string;
    Url: string;
}
