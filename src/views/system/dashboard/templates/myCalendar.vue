<template>
    <el-card :style="{height:cardHeight}" class="home-card changeShadow">
        <div slot="header" class="clearfix">
            <span>{{  }}</span>
            <ibps-desktop-toolbar
                ref="toolbar"
                :actions="[{key:'refresh'},{key:'fullscreen'},{key:'collapse'}]"
                @action-event="handleActionEvent"
            />
        </div>
        <transition name="draw" mode="in-out" appear>
            <div ref="body" :style="{height:showHeight,width:'100%'}" class="text item">
                <v-full-calendar :options="getFullCalendarConfig(data)" :style="{height:getHeight(),width:'100%'}" />
            </div>
        </transition>
    </el-card>
</template>