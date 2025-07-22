export type allwords =
    'panel.title' | // 标题

    'tab.dataQuery' | // tab-数据查询
    'tab.dataQuery.title' | // tab-数据查询-标题
    'tab.dataQuery.searchKeyword.label' | // tab-数据查询-关键字搜索-label
    'tab.dataQuery.searchKeyword.placeholder' | // tab-数据查询-关键字搜索-placeholder
    'tab.dataQuery.type.mvp' | // tab-数据查询-类型筛选-mvp
    'tab.dataQuery.type.obtain' | // tab-数据查询-类型筛选-获取
    'tab.dataQuery.type.steal' | // tab-数据查询-类型筛选-偷窃

    'tab.itemObtainRank' | // tab-掉落排名
    'tab.itemObtainRank.title' | // tab-掉落排名-标题

    'tab.newsStatistic' | // 消息统计
    'tab.newsStatistic.title' | // 消息统计-标题
    'tab.newsStatistic.groupBy' | // 消息统计-统计维度
    'tab.newsStatistic.groupBy.subject' | // 消息统计-统计维度-按物品
    'tab.newsStatistic.groupBy.object' | // 消息统计-统计维度-按任务

    'tab.newsStatistic.input.label.whenSubject' | // 消息统计-统计维度 输入框-label-按物品时
    'tab.newsStatistic.input.placeholder.whenSubject' | // 消息统计-统计维度 输入框-placeholder-按物品时
    'tab.newsStatistic.input.label.whenObject' | // 消息统计-统计维度 输入框-label-按人物时
    'tab.newsStatistic.input.placeholder.whenObject' | // 消息统计-统计维度 输入框-placeholder-按人物时

    'tab.MVPSubscribe' | // mvp 订阅
    'tab.MVPSubscribe.title' | // mvp 订阅-标题
    'tab.MVPSubscribe.unsubscribe' | // mvp 订阅-取消订阅
    'tab.MVPSubscribe.unsubscribe.confirm' | // mvp 订阅-取消订阅-二次确认

    // table
    "tableCol.id" |
    "tableCol.object" |
    "tableCol.objectId" |
    'tableCol.subject' |
    'tableCols.type' |
    'tableCols.cnt' |
    'tableCols.map' |
    'tableCols.mvpName' |

    // 通用
    'query' | // 查询按钮
    'refresh' | // 刷新按钮
    'unknown' |  // 未知
    'language' | // 语言
    'navToDataQuery' | // 跳转查询页
    'navToRanking' | // 跳转排行页
    'map' | // 世界地图
    'option'  // 操作


export type WordMap = Record<allwords, string> 