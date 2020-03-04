# tile-template

Template for tile development

## Getting Started

To copy the tile template into your existing directory or folder run this commond on your terminal

```bash
git clone --depth 1 https://github.com/moduware/tile-template.git temp && rm -rf temp/.git && mv temp/* temp/.gitignore . && rm -rf temp
```

## Alternate template using Webpack

To copy the tile template with webpack setup, you can clone the `webpack` branch from the pwa-starter-kit repo:

```bash
git clone --depth 1 -b template-typescript --single-branch https://github.com/moduware/tile-template.git temp && rm -rf temp/.git && mv temp/* temp/.gitignore . && rm -rf temp
```

To install all dependency run:

```
npm install
```

To start server and view locally run: 

```
npm start
```

To build files for production run:

```
npm run build
```
