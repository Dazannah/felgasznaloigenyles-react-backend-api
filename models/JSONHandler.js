const { writeFile, readFile } = require('fs');

class JSONHandler{
    path = '../mails.json'

    async write(dataToWrite){
        writeFile(this.path, JSON.stringify(dataToWrite, null, 2), (error) => {
          if (error) {
            console.log('An error has occurred ', error);
            return;
          }
          console.log('Data written successfully to disk');
        });
    }

    async read(whatToDo){
        return readFile(this.path, (error, data) => {
            if (error) {
                console.log(error)
              if(error.code === "ENOENT"){
                whatToDo([])
              }
              return 
            }

            const json = JSON.parse(data);
            whatToDo(json)
        });
    }

    async sendEmailIfAny(){
        await this.read(async json =>{
            if(json.length > 0){
                console.log("Parse e-mails")
                await this.write([])
            }
        })
    }

    async addEmail(email){
        await this.read(async json =>{
            json.push(email)
            await this.write(json)
        })
    }

}

module.exports = JSONHandler