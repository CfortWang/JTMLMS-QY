import { mount } from '@vue/test-utils'
import IbpsIcon from '@/components/ibps-icon/index.vue'

describe('ibps-icon', () => {
  // 存在且是Vue组件实例
  it('is a vue instance', () => {
    const wrapper = mount(IbpsIcon)

    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  // 包含特定类名
  it('contains specific classnames', () => {
    const wrapper = mount(IbpsIcon)

    expect(wrapper.is('.ibps')).toBeTruthy()
    expect(wrapper.contains('.ibps-font-awesome')).toBeTruthy()
  })

  // props
  it('has props', () => {
    const wrapper = mount(IbpsIcon, {
      propsData: {
        name: 'font-awesome'
      }
    })

    expect(wrapper.props().name).toEqual('font-awesome')
  })
})
