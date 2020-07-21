// prevent segmentation crashes from sharp
const sharp = require("sharp")

sharp.cache(false)
sharp.simd(false)

exports.onCreateWebpackConfig = ({stage,
    rules,
    loaders,
    plugins,
    actions}) => {
    if (stage === "build-html") {
      actions.setWebpackConfig({module: {rules: [
            {test: /canvas/,
              use: loaders.null()}
          ]}})
    }
  }