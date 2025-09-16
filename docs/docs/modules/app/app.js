(() => {
  let isFirstTime = true;
  // Change this component at your convenience:
  Vue.component("App", {
    template: $template,
    props: {
      uuid: {
        type: String,
        default: () => {
          return Vue.prototype.$lsw.utils.getRandomString(10);
        }
      }
    },
    data() {
      return {
        isMounted: false,
        selectedPanel: "edicion", // also: "edicion", "visualizacion"
        source: "Texto **de ejemplo**.",
        compilated: "",
      };
    },
    methods: {
      selectPanel(panel) {
        this.$trace("App.methods.selectPanel");
        this.selectedPanel = panel;
      },
      compile() {
        this.$trace("App.methods.compile");
        this.compilated = LswMarkdown.global.parse(this.source);
      },
      visualize() {
        this.$trace("App.methods.visualize");
        this.selectPanel("visualizacion");
      },
      exportAsLink() {
        this.$trace("App.methods.exportAsLink");
        console.log("exporting as link");
        const parameters = new URLSearchParams({ source: this.source });
        const url = new URL(window.location.href);
        const productLink = `${url.protocol}//${url.hostname}${url.pathname}?${parameters.toString()}`;
        LswUtils.copyToClipboard(productLink);
        this.$lsw.toasts.send({
          title: "Link exportado al portapapeles",
          text: productLink,
        });
      }
    },
    async mounted() {
      console.log("[💛] Application mounted.");
      this.isMounted = true;
      if (isFirstTime) {
        Vue.prototype.$app = this;
        isFirstTime = false;
        window.dispatchEvent(new CustomEvent("lsw_app_mounted", {
          applicationUuid: this.uuid,
          $lsw: this.$lsw,
          appComponent: this,
        }));
        await LswLifecycle.onApplicationMounted();
        Adjust_text_height: {
          this.$refs.editorDeTexto.style.height = (this.$window.innerHeight - 70) + "px";
        }
        Load_link: {
          const parameters = new URLSearchParams(window.location.search);
          const source = parameters.get("source");
          if(!source) {
            break Load_link;
          }
          this.source = source;
          this.visualize();
        }
      }
    }
  });
})(); 