module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [
          require("tailwindcss"),
          require("./tailwind.config.js"), // Optional: Load custom Tailwind CSS configuration
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyAa6IFn725sIJVVVk-4-XJL84DNZcTTpjE",
          authDomain: "treetop-learning-1589657684780.firebaseapp.com",
          databaseURL: "https://treetop-learning-1589657684780.firebaseio.com",
          projectId: "treetop-learning-1589657684780",
          storageBucket: "treetop-learning-1589657684780.appspot.com",
          messagingSenderId: "668994241265",
          appId: "1:668994241265:web:259abdd888c1e60098df50",
          measurementId: "G-4XM0YKCT81",
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/assets/logo.svg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyAa6IFn725sIJVVVk-4-XJL84DNZcTTpjE",
          authDomain: "treetop-learning-1589657684780.firebaseapp.com",
          databaseURL: "https://treetop-learning-1589657684780.firebaseio.com",
          projectId: "treetop-learning-1589657684780",
          storageBucket: "treetop-learning-1589657684780.appspot.com",
          messagingSenderId: "668994241265",
          appId: "1:668994241265:web:259abdd888c1e60098df50",
          measurementId: "G-4XM0YKCT81",
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
