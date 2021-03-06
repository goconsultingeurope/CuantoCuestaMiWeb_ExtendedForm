const imageTypes = ['image/gif', 'image/jpeg', 'image/png'];

//window.addEventListener('load', function(){
    
    let response = [{},{},{},{},{},{}];

    //Links
        function link_change_listener (link, e){
            let pos = parseInt(link.dataset.pos),
                prop = link.dataset.prop? link.dataset.prop : 'link';
            response[pos][prop] = e.target.value;
            AllowReLoad()
        }

        document.querySelectorAll('.link').forEach( link => 
            link.addEventListener('change', e => link_change_listener(link, e))
        );
    
    //TextAreas
        function textArea_change_listener (textArea, e){
            let pos = parseInt(textArea.dataset.pos),
                prop = textArea.dataset.prop? textArea.dataset.prop : 'textArea';
            response[pos][prop] = e.target.value;
            AllowReLoad()
        }
        
        document.querySelectorAll('.ta').forEach( textArea => 
            textArea.addEventListener('change', e => textArea_change_listener(textArea, e))
        );

    //File input loaders
        let files_loaded = Array.prototype.slice.call(document.querySelectorAll('.files_loaded')),
            file_loaders = Array.prototype.slice.call(document.querySelectorAll('.file--loader'));
        
        function inpFile_change_listener(inp_file, i){  
            let pos = parseInt(inp_file.dataset.pos),
                prop = inp_file.dataset.prop? inp_file.dataset.prop : 'inpFile',
                max = parseInt(inp_file.dataset.max);

                
            inp_file.onchange = e => {
                AllowReLoad()
                let acceptedFiles = e.target.files;
                var reader = new FileReader();

                let id = Math.random().toString(36).substr(2, 9),
                    doc = document.createElement( 'div' );
                    doc.classList.add('row');
                    doc.classList.add('document');
                    doc.innerHTML = `<img src='./imgs/doc.svg' id='${'img'+id}' alt="doc">
                    <div><h5>${acceptedFiles[0].name}</h5><p class='loading' id='${'p'+id}'>Cargando...</p></div>`;
                    files_loaded[i].appendChild(doc);
                
                reader.onload = e => {
                    response[pos][prop] = response[pos][prop]? [...response[pos][prop], acceptedFiles[0]] : [acceptedFiles[0]];                    
                    
                    let p = this.document.querySelector(`#${'p'+id}`);
                    p.innerText = 'Cargado';
                    p.classList.remove('loading');

                    if(imageTypes.includes(acceptedFiles[0].type))
                        document.querySelector(`#${'img'+id}`).src = e.target.result;
                    
                    if(response[pos][prop].length === max){
                        inp_file.disabled = true;
                        file_loaders[i].style.opacity = .3;
                    }
                }
                reader.readAsDataURL(acceptedFiles[0]);
                
            }
        }

        document.querySelectorAll('.inp_loader').forEach( (inp_file, i) => inpFile_change_listener(inp_file, i));

    /*   SPECIFICS   */
    //General Guideline just have textArea and file input, so its done

    //Reference Website
        let websites_amoung = 1;
        btn_add_refWeb.onclick = e => add_website('refWeb', 'row_refWeb', 1, websites_amoung);

    //Languages
        ( ()=>{
            const languages = ['English','Spanish','French','German','Portuguese','Italian','Dutch','Catalan','Mandarin','Arabic','Hindi','Russian'];
            languages.forEach( l => {
                let option = this.document.createElement('option'),
                    id = Math.random().toString(36).substr(2, 9);
                option.value = l;
                option.innerText = l;
                select_main_language.appendChild(option);

                option = this.document.createElement('div');
                option.classList.add('row');
                option.innerHTML = `<input id='check_languajes${id}' type="checkbox" name="${l}"></input><p>${l}</p>`;
                row_secondary_language.appendChild(option);

                this.document.querySelector('#check_languajes'+id).addEventListener('change', e => {
                    e.preventDefault();
                    AllowReLoad()
                    let currentLanguages = response[2]['secondary_languajes']? response[2]['secondary_languajes'].length : 0;
                    let allowedLanguages = userPrevResponse.answers[3][2] - 1;

                    if(e.target.checked){
                        if( currentLanguages < allowedLanguages){
                            response[2]['secondary_languajes'] = response[2]['secondary_languajes']? [...response[2]['secondary_languajes'], e.target.name] : [e.target.name];
                            e.target.checked = true;
                        }else{
                            e.target.checked = false;
                        }
                    }else{
                        response[2]['secondary_languajes'] = response[2]['secondary_languajes'].filter( val => val !== e.target.name );
                        checked = false;
                    }
                });
            })
        })();

    //Products or services just have file input, so its done

    //Sections
        let sections_amoung = 1;
        btn_add_sections.onclick = e => {
            if(sections_amoung < userPrevResponse.answers[3][0]){

                AllowReLoad()
                let id = Math.random().toString(36).substr(2, 9),
                    section = this.document.createElement('section');
    
                section.classList.add('row');
                section.innerHTML = `
                    <div class="description">
                        <h5>Description, instructions:</h5>
                        <textarea id='ta_sections${id}' data-pos='4' data-prop='textArea${sections_amoung}' class='ta' type="text" placeholder="I like when they show their projects with a movement in the background images(?)"></textarea>
                    </div>
                    <div class="visualRef">
                        <h5>Visual Reference</h5>
                        <div class="file--loader">
                            <p>Attach files here. Theres 2 files max limit.</p>
                            <input type="file" id='inpt_file_sections${id}' data-pos='4' data-prop='inpFile${sections_amoung}' data-max='2' class="inp_loader">
                        </div>
                        <div id='files_loaded_sections${id}' class="row files--loaded files_loaded"></div>
                    </div>`;
                container_sections.appendChild(section);
    
                let ta = this.document.querySelector('#ta_sections'+id);
                ta.addEventListener('change', e => textArea_change_listener(ta, e));
                files_loaded.push( this.document.querySelector('#files_loaded_sections'+id) );
    
                let inpFile = this.document.querySelector('#inpt_file_sections'+id);
                file_loaders.push(inpFile);
                inpFile_change_listener(inpFile, (files_loaded.length-1));
    
                sections_amoung++;

                if(sections_amoung >= userPrevResponse.answers[3][0]) btn_add_sections.style.opacity = '0.5';
            }
        }

    //External data
    let websites_payment_amoung = 1;
    btn_add_payment.onclick = e => add_website('payment', 'websites_payment', 5, websites_payment_amoung);

    function add_website(section, parent, pos, amoung_ref) {
        let id = Math.random().toString(36).substr(2, 9),
            div = this.document.createElement('div');
            AllowReLoad()
        div.classList.add('website');
        div.innerHTML = `<h5>Link</h5>
        <input type="text" id='link_${section}${id}' data-prop='link${amoung_ref}' data-pos='${pos}' placeholder="www.goconsulting.com">
        <h5>Description, instructions:</h5>
        <textarea id='ta_${section}${id}' data-pos='${pos}' data-prop='textArea${amoung_ref}' class='ta' type="text" placeholder="I like when they show their projects with a movement in the background images(?)"></textarea>`;
        document.querySelector('#'+parent).appendChild(div);

        let ta = this.document.querySelector('#ta_'+section+id);
        ta.addEventListener('change', e => textArea_change_listener(ta, e));

        let link = this.document.querySelector('#link_'+section+id);
        link.addEventListener('change', e => link_change_listener(link,e));

        section === 'payment'? websites_payment_amoung++ : websites_amoung++;
    }
    
    //let step = 0;
    //let uploading = false;
    //document.querySelector('#detInfo--next').addEventListener('click', ()=> {
    const triggerUploading = () => {
        if(detInfoUploading===false){
            uploadingNextBtn(true);
            let obj = {},
            prop = detailedInformationSteps[detInfoProgressBarStep-1].replace(' ', '');
            obj[prop] = response[detInfoProgressBarStep-1];
    
            valProp( obj[prop], prop, Object.keys( obj[prop] ), 0, obj[prop], response => {
                obj[prop] = response;
                writeData('requests/'+userPrevResponse.id, obj, e => {
                    e? uploadingNextBtn(false) : this.alert('fallo cargando los archivos, porfavor reintente');
                });
            });
        }else{
            return;
        }
    };

    function uploadingNextBtn(val) {
        detInfoUploading = val;
        if(val === false) alreadyUploaded[detInfoProgressBarStep-1] = true;
        document.querySelector('#detInfo--next').innerHTML = val? 'uploading' : detInfoProgressBarStep === 6? 'terminar' : 'next';
        document.querySelector('#detInfo--next').style.opacity = val? .3 : 1;
    }

    function valProp(obj, prop, keys, keyIndex, temp, callBack) {
        if ( keyIndex < keys.length ) {
            if(keys[keyIndex].includes('inpFile')){
                let path = userPrevResponse.id+'/extForm/'+prop+'/'+keys[keyIndex];
                
                upload(obj[keys[keyIndex]], 0, path, files => {
                    temp[ keys[keyIndex] ] = files;
                    valProp(obj, prop, keys, keyIndex+1, temp, callBack);
                });
            }else{
                valProp(obj, prop, keys, keyIndex+1, temp, callBack );
            }
        }else{
            callBack( temp );
        }
    }

    function upload(files, fileIndex, path, callBack) {
        let file = files[fileIndex];
        if(typeof file === 'string'){
            if (fileIndex+1 < files.length){
                return upload(files, fileIndex+1, path, callBack);
            }else {
                callBack( files );
            }
            return;
        }

        uploadFile(path, file.name, file, { contentType: file.type+'' }, response => {
            files[fileIndex] = response;
            if (fileIndex+1 < files.length){
                return upload(files, fileIndex+1, path, callBack);
            }else {
                callBack( files );
            }
        });
    }


    function AllowReLoad () {
        alreadyUploaded[detInfoProgressBarStep-1] = false;
        document.querySelector('#detInfo--next').innerHTML = 'Upload<img src="./imgs/nextArrow.svg" alt="">';
    }
    
//});

/*
    for (const key in obj[prop]) {
            if (obj[prop].hasOwnProperty(key) && key.includes('inpFile')) {

                for (let i = 0; i < obj[prop][key].length;) {
                    let path = userPrevResponse.id+'/extForm/'+prop+'/'+key;
                    let file = obj[prop][key][i];

                    uploadFile(path, file.name, file, {
                        contentType: file.type+''
                    }, response => {
                        this.console.log(response);
                        obj[prop][key][i] = response;
                        i++;
                    });

                  this.console.log('classic for volta', i);
                } 
                this.console.log('end classic for');
            }
            this.console.log('in for volta');
        }
*/