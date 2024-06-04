/**
 * ueditor 配置
 */
import { serverUrl, fileUrl } from '@/api/platform/file/ueditor'

const config = function() {
  return {
    UEDITOR_HOME_URL: `${process.env.BASE_URL}lib/UEditor/`,
    // TODO: 如果需要上传功能,找后端小伙伴要服务器接口地址
    serverUrl: serverUrl(),
    fileServerUrl: fileUrl(), // 附件上传
    // 编辑器不自动被内容撑高
    autoHeightEnabled: false,
    // 初始容器高度
    initialFrameHeight: 360,
    // 初始容器宽度
    initialFrameWidth: '100%',
    // 关闭自动保存
    enableAutoSave: false
  }
}

export default config
