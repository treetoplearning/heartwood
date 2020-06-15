// prevent segmentation crashes from sharp
const sharp = require("sharp")

sharp.cache(false)
sharp.simd(false)
