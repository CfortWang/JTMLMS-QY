<template>
  <div style="width: 86%;">
          <div style="font-size:32px; font-weight: bold; color:rgb(51, 150, 209); margin-top: 10%;text-align: center;">
             <img src="./img/logo_MJJC.jpg" width="22%">
              </br>
                 <i style="font-size:28px;" :class="'ibps-icon-'+$route.query.icon"></i>
                  {{$route.query.name}}
                </br>
                 <span style="color: #1894d0; font-size: 16px;">选择左侧菜单功能项</span>
          </div>
       </div>
</template>

<script>

</script>

<style>
</style>
