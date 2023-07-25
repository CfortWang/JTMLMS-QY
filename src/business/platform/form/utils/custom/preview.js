import dialog from '@/utils/dialog'
import Pdfh5 from 'pdfh5'
import 'pdfh5/css/pdfh5.css'
import { snapshoot } from '@/api/platform/file/attachment' // 印章，快照
import { download } from '@/api/platform/file/attachment'
import ActionUtils from '@/utils/action'

export const preview = (tableForm, url) => {
    var flag = true
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        flag = false
    }
    if (flag) {
        dialog(
            {
                data () {
                    return {
                        readonly: false,
                        data: ''
                    }
                },

                template: `<div style="height:100%"><iframe src="${url}" id="myiframe" frameborder="0" scrolling="no" height="100%" width="100%"></iframe></div>`
            },
            {
                dialog: {
                    appendToBody: true,
                    width: '90%',
                    top: '1vh',
                    center: true,
                    title: '',
                    'custom-class': 'ibps-dialog-91'
                }
            }, (tpl) => {
                tableForm.dialogTemplate = tpl
            }
        ).catch((_this) => {
            _this.visible = false
            tableForm.dialogTemplate = null
        })
    } else {
        dialog(
            {
                data () {
                    return {
                        readonly: false,
                        data: '',
                        pdfh5: null,
                        name: '',
                        url: ''
                    }
                },
                mounted () {
                    this.getFile()
                },
                methods: {
                    getFile () {
                        const urlList = url.split('rpx=')[1].split('.rpx&id_=')
                        const name = urlList[0].split('/')
                        this.name = name[name.length - 1]
                        const params = {
                            url: tableForm.$getReportFile(urlList[0], `id_=${urlList[1]}`),
                            name: name[name.length - 1] || '未命名',
                            type: 'pdf'
                        }
                        snapshoot(params).then(res => {
                            const { data = null } = res
                            if (!data) {
                                tableForm.$message.error('获取文件信息失败！')
                                return
                            }
                            this.getDownload(data.id)
                        })
                    },
                    getDownload (id) {
                        download({ attachmentId: id }).then(res => {
                            this.render(res.data)
                            this.url = res.data
                        })
                    },
                    render (url) {
                        this.$nextTick(() => {
                            this.pdfh5 = new Pdfh5('#demo', {
                                // pdfurl: window.location.origin + '/' + url,
                                data: url
                                // lazy: true
                            })
                            this.pdfh5.on('complete', (status, msg, time) => {
                                // console.log(status, msg, time)
                            })
                        })
                    },
                    close () {
                        tableForm.dialogTemplate = null
                        this.visible = false
                    },
                    download () {
                        ActionUtils.exportFile(this.url, `${this.name}.pdf`)
                    }
                },
                template:
                `<div style="height:100%">
                    <div id="demo"></div>
                    <div style="position:absolute;right: 17px;top: 15px;" >
                        <i class="el-icon-download" style="font-size: 24px;margin-right:15px" @click="download"></i>
                        <i class="el-icon-close" style="font-size: 24px;" @click="close"></i>
                    </div>
                </div>`
            },
            {
                dialog: {
                    appendToBody: true,
                    width: '90%',
                    top: '1vh',
                    center: true,
                    title: '',
                    'custom-class': 'ibps-dialog-91'
                }
            }, (tpl) => {
                tableForm.dialogTemplate = tpl
            }
        ).catch((_this) => {
            _this.visible = false
            tableForm.dialogTemplate = null
        })
    }
}
