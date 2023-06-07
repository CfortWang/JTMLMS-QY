import dialog from '@/utils/dialog'
import Pdfh5 from "pdfh5";
import "pdfh5/css/pdfh5.css";
import { snapshoot } from '@/api/platform/file/attachment' //印章，快照
import { download } from '@/api/platform/file/attachment'
import ActionUtils from '@/utils/action'

const getPint = (tableForm, srcUrl) => {
    var flag = true;
    if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        flag = false
    }
    if (flag) {
        dialog(
            {
                data() {
                    return {
                        readonly: false,
                        data: ''
                    }
                },

                template: '<div style="height:100%">' +
                    '<iframe src="' + srcUrl + '"' +
                    'id="myiframe"  frameborder="0" scrolling="no" height="100%" width="100%"></iframe>' +
                    '</div>'
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
                data() {
                    return {
                        readonly: false,
                        data: '',
                        pdfh5: null,
                        name: '',
                        url: ``
                    }
                },
                mounted() {
                    this.getYab()
                },
                methods: {
                    getYab() {
                        let srcUrl1 = srcUrl.split('rpx=')[1]
                        let srcUrlList = srcUrl1.split('.rpx&id_=')
                        let name = srcUrlList[0].split('/')

                        let url = tableForm.$getReportFile(srcUrlList[0], `id_=${srcUrlList[1]}`)
                        this.name = name[name.length - 1] + '.pdf'
                        let params = {
                            url: url,
                            name: name[name.length - 1] || '暂无',
                            type: 'pdf'
                        }
                        snapshoot(params).then(res => {
                            if (res.state == 200) {
                                const data = res.data
                                this.getDownload(data.id)
                            }
                        })
                    },
                    getDownload(id) {
                        download({
                            attachmentId: id
                        }).then(res => {
                            this.getMet(res.data)
                            this.url = res.data
                        }).catch(() => {
                        })
                    },
                    getMet(url) {
                        let that = this
                        // //实例化1
                        that.$nextTick(() => {
                            that.pdfh5 = new Pdfh5("#demo", {
                                // pdfurl: window.location.origin + '/' + url,
                                data: url,
                                // lazy: true
                            })
                            that.pdfh5.on("complete", function (status, msg, time) {
                                // console.log(status, msg, time)
                            })
                        });
                    },
                    finish() {
                        this.visible = false
                        tableForm.dialogTemplate = null
                    },
                    xiazan() {
                        ActionUtils.exportFile(
                            this.url,
                            this.name
                        )
                    }
                },
                template:
                    `<div style="height:100%">
                    <div id="demo"></div>
                    <div style="position:absolute;right: 17px;top: 15px;" >
                        <i class="el-icon-download" style="font-size: 24px;margin-right:15px" @click="xiazan"></i>
                        <i class="el-icon-close" style="font-size: 24px;" @click="finish"></i>
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
export default getPint
