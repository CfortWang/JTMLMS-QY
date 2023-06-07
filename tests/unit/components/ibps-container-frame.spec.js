import { mount } from '@vue/test-utils'
import IbpsContainerFrame from '@/components/ibps-container-frame/index.vue'

describe('ibps-container-frame', () => {
  // 存在且是Vue组件实例
  it('is a vue instance', () => {
    const wrapper = mount(IbpsContainerFrame, {
      stubs: ['ibps-container']
    })

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  // 包含特定类名
  it('contains specific classnames', () => {
    const wrapper = mount(IbpsContainerFrame, {
      stubs: ['ibps-container']
    })

    expect(wrapper.contains('.ibps-container-frame')).toBeTruthy()
  })

  // props
  it('has props', () => {
    const wrapper = mount(IbpsContainerFrame, {
      stubs: ['ibps-container'],
      propsData: {
        src: 'https://bpmhome.cn/ibps-admin/doc/zh/'
      }
    })

    expect(wrapper.props().src).toEqual('https://bpmhome.cn/ibps-admin/doc/zh/')
  })
})
