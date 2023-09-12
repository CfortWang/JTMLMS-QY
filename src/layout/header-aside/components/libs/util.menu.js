import { uniqueId } from 'lodash'
/**
 *
/**
 * @description 创建菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {String} indexKey  索引Key
 */
export function elMenuItem (h, menu, indexKey = 'path', stcss) {
    let icon = null
    const css = stcss
    if (menu.icon) icon = <i class={ `ibps-icon ibps-icon-${menu.icon}` }/>
    else if (menu.iconSvg) icon = <ibps-icon-svg name={ menu.iconSvg }/>
    else icon = <i class='ibps-icon ibps-icon-file-o'/>
    const index = menu[indexKey] || uniqueId('ibps-menu-empty-')
    return <el-menu-item
        style='height:37px;line-height:37px;font-weight: bold; font-size:13px;'
        key={ index }
        index={ index }>
        {css} { icon }
        <span slot='title'>{ menu.name || this.$t('layout.header-aside.menu-item.label-default')}</span>
    </el-menu-item>
}
export function elMenuItem2 (menu, indexKey = 'path', stcss) {
    let icon = null
    const css = stcss
    if (menu.icon) icon = <i class={ `ibps-icon ibps-icon-${menu.icon}` }/>
    else if (menu.iconSvg) icon = <ibps-icon-svg name={ menu.iconSvg }/>
    else icon = <i class='ibps-icon ibps-icon-file-o'/>
    const index = menu[indexKey] || uniqueId('ibps-menu-empty-')
    return <el-menu-item
        style='height:37px;line-height:37px;font-weight: bold; font-size:13px;'
        key={ index }
        index={ index }>
        {css} { icon }
        <span slot='title'>{ menu.name || this.$t('layout.header-aside.menu-item.label-default')}</span>
    </el-menu-item>
}
/**
 * @description 创建子菜单
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {String} indexKey  索引Key
 */
export function elSubmenu (h, menu, indexKey = 'path') {
    let icon = null
    if (menu.icon) icon = <i slot='title' class={ `ibps-icon ibps-icon-${menu.icon}` }/>
    else if (menu.iconSvg) icon = <ibps-icon-svg slot='title' name={ menu.iconSvg }/>
    else icon = <i slot='title' class='ibps-icon ibps-icon-folder-o'/>
    const index = menu[indexKey] || uniqueId('ibps-menu-empty-')
    return <el-submenu
        key={ index }
  	    style='box-shadow:0 2px 2px rgba(0, 0, 0, .1), 0 0 1px rgba(0, 0, 0, .02);font-weight: bold;'
        index={ index }>
        { icon }
        <span slot='title' style='font-size:13px'>{menu.name || this.$t('layout.header-aside.menu-item.label-default') }</span>
        { menu.children.map(child => createMenu.call(this, h, child, indexKey, '|')) }
    </el-submenu>
}
export function elSubmenu2 (menu, indexKey = 'path') {
    let icon = null
    if (menu.icon) icon = <i slot='title' class={ `ibps-icon ibps-icon-${menu.icon}` }/>
    else if (menu.iconSvg) icon = <ibps-icon-svg slot='title' name={ menu.iconSvg }/>
    else icon = <i slot='title' class='ibps-icon ibps-icon-folder-o'/>
    const index = menu[indexKey] || uniqueId('ibps-menu-empty-')
    return <el-submenu
        key={ index }
        style='box-shadow:0 2px 2px rgba(0, 0, 0, .1), 0 0 1px rgba(0, 0, 0, .02);font-weight: bold;'
        index={ index }>
        { icon }
        <span slot='title' style='font-size:13px'>{menu.name || this.$t('layout.header-aside.menu-item.label-default') }</span>
        { menu.children.map(child => createMenu.call(this, child, indexKey, '|')) }
    </el-submenu>
}
/**
 * @description 在组件中调用此方法渲染菜单项目
 * @param {Function} h createElement
 * @param {Object} menu 菜单项
 * @param {String} indexKey  索引Key
 */
export function createMenu (h, menu, indexKey = 'path', stcss) {
    if (menu.children === undefined || menu.children === null) return elMenuItem.call(this, h, menu, indexKey, stcss)
    return elSubmenu.call(this, h, menu, indexKey)
}

export function createMenu2 (menu, indexKey = 'path', stcss) {
    if (menu.children === undefined || menu.children === null) return elMenuItem.call(this, menu, indexKey, stcss)
    return elSubmenu.call(this, menu, indexKey)
}
