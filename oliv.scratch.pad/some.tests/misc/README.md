## From Scratch, step-by-step

### Basic requirements
We need `nodejs` and its NodeJS Package Manager (aka `npm`). We assume they're
bot available on the machine you wanrt to work on.

### And then
We'll need `yeoman`. See if it is installed by typing
```bash
$ which yo
```
If the command returns nothing, you need to install it.
```bash
$ npm install --global yo
```
You might need some privileges to proceed, you may want to use `sudo`, or the method
explained [here](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md).

Once `yeoman` is installed, type
```bash
$ yo --version
```

Create a new directory, and drill down in it. This way you have a clean environment to get started.

Now build the scaffolding for your CCA project:
```bash
$ yo oraclejet myfirstCCA --template=basic
```
If the `oraclejet` template was not installed yet, no panic, install it by typing
```bash
$ npm install generator-oraclejet
```
This will install a bunch of stuff in a `node_modules` directory.

And now you can proceed, re-type the `yo` command:
```bash
$ yo oraclejet myfirstCCA --template=basic
```
This takes a few moments, and then you are good to go. Go into the newly created `myFirstCCA` directory.
There is a directory named `src/js`, create a directory in it:
```bash
$ mkdir src/js/jet-composites
```
and then an other one into it, thsi will be the "home" of your Composite Component
```bash
$ mkdir src/js/jet-composites/my-cc
```
##### MetaData
The composite meta-data need to be stored in this `my-cc` directory, as a `json` file. Name it
`my-cc.json`, and feed it with the following content:
```json
{
  "properties": {
    "badgeName": {
      "type": "string"
    },
    "badgeImage": {
      "type": "string"
    }
  }
}
```
We've defined 2 properties. 
> Notice the case. Property names use camel case. The tags will use the spine-case equivalents.

##### HTML Template
In the same `src/js/jet-composites/my-cc` directory, create an HTML template.
Name it `my-cc.tmpl.html`. Make its content look like this:
```html
<div class="badge-face">
  <img class="badge-image"
       data-bind="attr:{src: $props.badgeImage, alt: $props.badgeName, title: $props.badgeName}" />
  <h3 data-bind="text: $props.badgeName" />     
</div>
```
> Notice the `data-bind` attributes, the belong to  `knockout.js`.

This will:
* give the `img` element the following attributes:
  * `src` will take the value of the `badgeImage` member of the `json` metadata
  * `alt` and `title` will take the value of the `badgeName` member of the `json` metadata
* give the content of the `h3` tag the value of the `badgeName` member of the `json` metadata

##### CSS Stylesheet
This also refers to two `css` classes, `badge-face` and `badge-image`. They will need to be defined
in a `css` file located in the same `src/js/jet-composites/my-cc` directory, named it `my-cc.css`.
```css
my-cc:not(.oj-complete){
	visibility: hidden;
}
my-cc{
	display : block;
	width : 200px;
	height: 300px;
	margin : 10px;
}
my-cc .badge-face {
	height : 100%;
	width : 100%;
	background-color : #80C3C8;
	border-radius: 5px;
	text-align: center;
	padding-top: 30px;
}
my-cc .badge-image {
	height : 100px;
	width : 100px;
	border-radius: 50%;
	border:3px solid white;
}
```

##### Component ViewModel
This will be a `js` file, still located in the  `src/js/jet-composites/my-cc` directory, named it `my-cc.js`.
```javascript
define(['ojs/ojcore','knockout','jquery'], function (oj, ko, $) {
  'use strict';
    function MyCCComponentModel() {
      var self = this;
    };
    // Return a constructor for this componentModel
    return MyCCComponentModel;
});
```
> Notice the references made to `ojcore`, `knockout` and `jquery`. The two first ones are mandatory. `jquery` might not be needed in your case. Your call.

##### Loader
Still in the same location, create a `loader.js`:
```javascript
define(
		['ojs/ojcore',
			'./my-cc',             // refers to my-cc.js
			'text!./my-cc.html',   // template
			'text!./my-cc.json',   // metadata
			'css!./my-cc',         // stylesheet
			'ojs/ojcomposite'],
		function (oj,
		          ComponentModel, // my-cc.js
		          view,           // my-cc.html
		          metadata,       // my-cc.json
		          css) {          // my-cc.css
			'use strict';
			oj.Composite.register('my-cc', { // The name of the tag used in your page
						metadata: {inline: JSON.parse(metadata)},
						viewModel: {inline: ComponentModel},
						view: {inline: view},
						css: {inline: css}
					});
		}
);
```
#### Ready to use it
Ok, now we can use the Composite Component.

Create your own page, `src/js/views/myWork.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>My Work</title>
</head>
<body>
	<div>
		<h2>Test Composite</h2>
		<my-cc badge-name="Duke Mascot" badge-image="/images/duke.png"/>
	</div>
</body>
</html>
```
For the code above to work, create a directory named `images` in the `src` directory (the one containing `index.html`), and drop the image `duke.png` in it. 

Modify the `index.html` as instructed in the tutorial:
```html
      <div role="main" class="oj-web-applayout-max-width oj-web-applayout-content">
        <!-- Added stuff goes here -->
        <div data-bind="ojModule:'myWork'"/>
      </div>
```

Last, from the root directory (the one containing `Gruntfile.js`), run the following command:
```bash
 $ grunt serve
```
This should start a web server, and load the `index.html` in your default browser.

---