<template>
  <div>
      <div>

        <h2 class="px-4 my-6">
            Добро пожаловать в <div>DO SPORTS</div>
        </h2>
        <div>
          <div id="yandex_rtb_R-A-1707251-2"></div>
        </div>

      </div>
  </div>
</template>

<script>

export default {
    mounted() {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML =
            "window.yaContextCb.push(() => {\n" +
            "    Ya.Context.AdvManager.render({\n" +
            "        renderTo: 'yandex_rtb_R-A-1707251-2',\n" +
            "        blockId: 'R-A-1707251-2'\n" +
            "    })\n" +
            "})"
        let div = document.querySelector("#yandex_rtb_R-A-1707251-2");
        div.append(script);
    }

}
</script>

<style>

</style>