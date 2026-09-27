module.exports = {
  configureWebpack:{
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000,
      }
    }
  },
  chainWebpack: config => {
    // Fix for Buefy CSS bug - configure css-loader to not resolve function calls as URLs
    const cssRule = config.module.rule('css');
    ['vue-modules', 'vue', 'normal-modules', 'normal'].forEach(type => {
      cssRule.oneOf(type).use('css-loader').tap(options => {
        if (!options) options = {};
        options.url = {
          filter: (url) => {
            // Don't try to resolve URLs that look like function calls (e.g., checkmark(...))
            if (url && typeof url === 'string' && url.includes('checkmark(')) {
              return false;
            }
            return true;
          }
        };
        return options;
      });
    });
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/scss/_sass-compatibility.scss";
        `
      }
    }
  }
}