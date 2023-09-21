import Vue from 'vue'

export default function (component, options = { dialog: {}}, cb) {
    return new Promise(async (resolve, reject) => {
        const dialog = {
            appendToBody: true, // 对话框遮罩层是否插入至 body 元素上
            scrollToTop: false,
            ...options.dialog
        }
        // const footer = options.footer

        const template = Vue.extend({
            components: {
                'ibps-dialog-component': component
            },
            data () {
                return {
                    visible: true,
                    wrap: null
                }
            },
            methods: {
                onSubmit (data) {
                    resolve(this, data)
                },
                onCancel (data) {
                    reject(this, data)
                },
                onClose (done) {
                    done()
                    this.onCancel()
                },
                scrollToTop () {
                    if (this.wrap.scrollTop) {
                        this.wrap.scrollTop -= 200
                        requestAnimationFrame(this.scrollToTop)
                    }
                },
                toTop () {
                    this.wrap = document.querySelector('.el-dialog__wrapper')
                    this.scrollToTop()
                }
            },
            render () {
                var h = arguments[0]
                return h('el-dialog', {
                    'attrs': {
                        ...dialog,
                        class: dialog.className,
                        visible: this.visible,
                        beforeClose: this.onClose
                    }
                }, [h('ibps-dialog-component',
                    {
                        'on': {
                            'submit': this.onSubmit,
                            'cancel': this.onCancel
                        }
                    })]
                )

                // (
                //   <el-dialog
                //     {...{ attrs: data }}
                //     class={data.className}
                //     visible={this.visible}
                //     beforeClose={this.close}
                //   >
                //     <ibps-dialog-component onSubmit={this.submit} onCancel={this.cancel} {...options} />
                //     <div v-if={footer} slot='footer' >
                //       测试
                //     </div>
                //   </el-dialog>
                // )
            }
        })
        cb && cb(template)
    })
}
