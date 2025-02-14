const { execSync } = require("child_process");
const { existsSync, readFileSync,readdirSync, writeFileSync } = require("fs");
const { join } = require("path");
const os =require("node:os")
const { GOOGLE_IMG_SCRAP , GOOGLE_QUERY } = require('./google-img-scrap');
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
const parse=(array,file)=>{
	const choix=array.pop()
	console.log(typeof choix)
	if(typeof choix !=="undefined"){
	if(choix.trim().length>=1){
		run("npx hexo new post "+'"'+choix+'"',__dirname)
		writeFileSync(file,array.join('\n'))
	}
	parse(array,file)
}
	
	
}
const parsefile=(p)=>{
	if(existsSync(p)){
		content=readFileSync(p).toString().split("\n")
		parse(content,p)
	}
}
const runAction = (name) => {
	console.log(os.platform())
	console.log(name)
	if(os.platform()==="win32"){
		geturl(name).then((result)=>{
			//writeFileSync(`..\\cdn\\${name}.jpg`,result.url)
			run(`curl "${result}" -o ${name}.jpg `,__dirname+"./cdn")
		}).catch((err)=>{log(err)})
		
	}else{
		geturl(name).then((result)=>{
			console.log("lien :"+result)
			console.log(__dirname)
			console.log(readdirSync("./cdn"))
			/*&& curl "${result.replace('&amp;s','')}" -o cdn/${name}.jpg >${name}.log && cd cdn &&git add * * &&git commit -m"${name}" --amend &&git pull &&git push*/
		//	writeFileSync(`..\\cdn\\${name}.jpg`,result.url)
			run(`dir ./cdn && curl "${result.replace('&amp;s','')}" -o "./cdn/${name}.jpg" >${name}.log &&cd ./cdn &&git add * *  &&git commit -m"${name}" --amend &&git pull origin main --rebase  &&git push origin main`,__dirname+"")
		}).catch((err)=>{log(err)})
		
		//run(`curl https://thomas-iniguez-visioli.github.io/cdn/${name}.jpg -o "dist/${name+new Date().toString()}.jpg" `,__dirname)
	}
	parsefile("./add.txt")
	


};
const geturl=async (name)=>{
	const test = await GOOGLE_IMG_SCRAP({
        search: `affiche  ${name}`,
    });
	//console.log(test.result)
	if(test.result.length==0){
		return "https://thomas-iniguez-visioli.github.io/blog-cine/img/default.jpg"
	}
	return test.result[1].url
}
console.log(readdirSync("./source"))
readdirSync(join("./source","_posts")).map((filename)=>{
	console.log(filename)
	if(!forbiden.includes(filename)){
		runAction(filename.split(".")[0]);
	}
    
})

