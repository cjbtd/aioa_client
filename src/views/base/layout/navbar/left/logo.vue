<template>
  <img
    class="aioa-logo"
    :src="`/static/img/logo-${$utils.getCompanyId()}.ico`"
    :title="$utils._T('SwitchLang')"
    @click="$utils.changeLang()"
    onerror="this.src='/static/img/logo.ico'"
  />
</template>

<style lang="scss">
.aioa-logo {
  width: 40px;
  margin: 0 8px;
}
</style>
