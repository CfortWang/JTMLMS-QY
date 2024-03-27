export const typeOptions = [
    {
        value: '',
        label: '全部'
    },
    {
        value: 'normal',
        label: '普通',
        type: 'primary'
    },
    {
        value: 'system',
        label: '系统消息',
        type: 'danger'
    },
    // {
    //     value: 'bulletin',
    //     label: '公告',
    //     type: 'yellow'
    // }
]
export const typeMsg = [
    {
        value: '0',
        label: '未读',
        type: 'primary'
    },
    {
        value: '1',
        label: '已读',
        type: 'success'
    },
    {
        value: '2',
        label: '所有'
    }
]
export const renderHeader = function (h, { column, $index }) {
    return h('span', [
        h('el-tooltip', {
            props: {
                content: '是否已读'
            }
        }, [h('i', { class: 'ibps-icon-envelope-o' })]),
        h('el-tooltip', {
            props: {
                content: '是否有附件'
            }
        }, [h('i', { class: 'ibps-icon-paperclip' })]
        )
    ])
}
export const publicOrCanreplyOptions = [
    {
        value: 0,
        label: '否',
        type: 'danger'
    },
    {
        value: 1,
        label: '是'
    }
]
