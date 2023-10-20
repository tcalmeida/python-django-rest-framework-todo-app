function createList(){
    const wrapper = document.getElementById("list-wrapper")
    const url = 'http://127.0.0.1:8000/list-tasks/'

    fetch(url).then((resp) => resp.json()).then(function(data){
        console.log('data:', data)

        const list = data
        for (i in list){
            const task = `
                <div id='data-row-${i}' class='task-wrapper flex-wrapper'>
                    <div style="flex:7">
                        <span class='title'>${list[i].title}</span>
                    </div>
                    <div style="flex:1">
                        <button class='btn btn-sm btn-outline-info edit'>Edit</button>
                    </div>
                    <div style="flex:1">
                        <button class='btn btn-sm btn-outline-dark delete'>-</button>
                    </div>
                </div>
            `
            wrapper.innerHTML += task
        }
    })
}

createList()