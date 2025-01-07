const { execSync } = require("child_process");
const { existsSync, readFileSync,readdirSync } = require("fs");
const { join } = require("path");
const os =require("node:os")
const { GOOGLE_IMG_SCRAP , GOOGLE_QUERY } = require('google-img-scrap');
const { error } = require("console");
/**
 * Logs to the console
 */
const forbiden=[]
const log = (msg) => console.log(`\n${msg}`); // eslint-disable-line no-console

/**
 * Exits the current process with an error code and message
 */
const exit = (msg) => {
	console.error(msg);
	process.exit(1);
};

/**
 * Executes the provided shell command and redirects stdout/stderr to the console
 */
const run = (cmd, cwd) => execSync(cmd, { encoding: "utf8", stdio: "inherit", cwd });

/**
 * Determines the current operating system (one of ["mac", "windows", "linux"])
 */


/**
 * Returns the value for an environment variable (or `null` if it's not defined)


/**
 * Sets the specified env variable if the value isn't empty
 */


/**
 * Returns the value for an input variable (or `null` if it's not defined). If the variable is
 * required and doesn't have a value, abort the action
 */


/**
 * https://fr.web.img5.acsta.net/c_310_420/img/17/5f/175fbcee8f625ac212b06378b2d34435.jpg
 * Installs NPM dependencies and builds/releases the Electron app
 */
const runAction = (name) => {
	console.log(os.platform())
	console.log(name)
	if(os.platform()==="win32"){
		geturl(name).then((result)=>{
			run(`curl ${result} -o ..\\cdn\\${name}.jpg && git add *  `,__dirname)
		}).catch((err)=>{log(err)})
		
	}else{
		run(`curl https://thomas-iniguez-visioli.github.io/cdn/${name}.jpg -o dist/${name}.jpg`,__dirname)
	}

	


};
const geturl=async (name)=>{
	const test = await GOOGLE_IMG_SCRAP({
        search: `affiche  ${name}`,
    }).;
	console.log(test.result)
	if(test.result.length==0){
		return "https://thomas-iniguez-visioli.github.io/blog-cine/img/default.jpg"
	}
	return test.result[0].url
}
console.log(readdirSync("./source"))
readdirSync(join("./source",readdirSync("./source")[0])).map((filename)=>{
	console.log(filename)
	if(!forbiden.includes(filename)){
		runAction(filename.split(".")[0]);
	}
    
})

