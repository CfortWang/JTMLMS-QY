import dialog from '@/utils/dialog'
import Pdfh5 from 'pdfh5'
import 'pdfh5/css/pdfh5.css'
import { snapshoot, download } from '@/api/platform/file/attachment' // 印章，快照
import ActionUtils from '@/utils/action'

export const preview = (tableForm, url) => {
    let isMobile = false
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        isMobile = true
    }
    if (!isMobile) {
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
                    top: '3vh',
                    center: true,
                    title: '',
                    showClose: true,
                    closeOnClickModal: false,
                    'custom-class': 'ibps-dialog-91 btn-cover'
                },
            },
            (tpl) => {
                tableForm.dialogTemplate = tpl
                const hasHighRole = localStorage.getItem('hasHighRole')
                if (hasHighRole === 1) {
                    return
                }
                setTimeout(() => {
                    const toolbarCover = document.createElement('div')
                    toolbarCover.classList.add('toolbar-cover')
                    toolbarCover.addEventListener('click', () => {
                        confirm('无权操作，请联系系统管理员！', '提示')
                    })
                    document.querySelector('.btn-cover').children[1].appendChild(toolbarCover)
                }, 1000)
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
                        const urlList = url.split('rpx=')[1].split('&id_=')
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
                    downloadFile () {
                        ActionUtils.exportFile(this.url, `${this.name}.pdf`)
                    }
                },
                template:
                `<div style="height:100%">
                    <div id="demo"></div>
                    <div style="position:absolute;right: 17px;top: 15px;" >
                        <i class="el-icon-download" style="font-size: 24px;margin-right:15px" @click="downloadFile"></i>
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
