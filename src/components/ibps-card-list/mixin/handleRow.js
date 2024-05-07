
export default {
    props: {
        /**
         * @description 管理列
         */
        rowHandle: {
            type: Object,
            default: null
        }
    },
    computed: {
        // rowHandleActions (row) {
        //     const { actions = null } = this.rowHandle || {}
        //     if (!actions) {
        //         return null
        //     }
        //     console.log(actions, actions.filter(i => !this.handleActionHidden(i.hidden, row)))
        //     return actions.filter(i => !this.handleActionHidden(i.hidden, row))
        // }
    },
    methods: {
        rowHandleActions (row) {
            const { actions = null } = this.rowHandle || {}
            if (!actions) {
                return null
            }
            return actions.filter(i => !this.handleActionHidden(i.hidden, row))
        },
        handleActionHidden (hidden = false, row) {
            let isHidden = hidden
            if (typeof hidden === 'boolean') {
                isHidden = hidden
            } else if (typeof hidden === 'function') {
                isHidden = hidden.call(this, row)
            }
            return isHidden
        }
    }
}
