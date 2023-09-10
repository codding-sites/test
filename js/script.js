window.onload = function () {
    document.addEventListener("click", documentActions);
    function documentActions(e) {
        const targetElement = e.target;
        if (targetElement.classList.contains('button')) {
            getValues(targetElement)
        }

    };

    async function request() {
        const file = "js/json.json";
        let response = await fetch(file, {
            method: "GET"
        });
        if (response.ok) {
            let result = await response.json();
            createElements(result)
        } else {
            alert(`Error with json file adress: ${file}`);
        };
    };
    request();

    function createElements(result) {
        document.querySelector('.value').insertAdjacentHTML('beforeend', '<input type="number"></input>');
        const unitsCollection = result.units;
        const unitFrom = document.createElement("select");
        const unitTo = document.createElement("select");
        document.querySelector('.unit').appendChild(unitFrom);
        document.querySelector('.convent').appendChild(unitTo);

        for (const key in unitsCollection) {
            if (unitsCollection.hasOwnProperty(key)) {
                const optionElement = document.createElement("option");
                optionElement.value = key;
                optionElement.textContent = key;
                const clonedElement = optionElement.cloneNode(true);
                unitFrom.appendChild(clonedElement);
                unitTo.appendChild(optionElement);
            }
        }
    }


    function getValues(targetElement) {
        if (!targetElement.classList.contains('hold')) {
            const tegP = document.querySelector('.result p')
            if (tegP) {
                document.querySelector('.result').removeChild(tegP)
            }
            targetElement.classList.add('hold')
            const distance = document.querySelector('.value input').value;
            const resultParent = document.querySelector('.result');
            const unitFrom = document.querySelector('.unit select').value;
            const unitTo = document.querySelector('.convent select').value;
            if (distance) {
                (async () => {
                    const result = await convertDistance(distance, unitFrom, unitTo);
                    resultParent.insertAdjacentHTML('beforeend', `<p>${result}</p>`)
                })();
            }
            targetElement.classList.remove('hold')
        }
    }
    
    async function convertDistance(distance, unitFrom, unitTo) {
        const file = "js/json.json";
        let response = await fetch(file, {
            method: "GET"
        });
        if (response.ok) {
            let result = await response.json();
            if (unitFrom === unitTo) {
                return distance;
            }
            const rateFrom = result.units[unitFrom];
            const rateTo = result.units[unitTo];
            if (rateFrom && rateTo) {
                return (`{"distance": {"unit": "${unitFrom}", "value": ${distance}, "conventTo": "${unitTo}"}<br>{"unit": ${unitTo}, "(${((distance * rateTo) / rateFrom).toFixed(2)})"}`);
            } else {
                return NaN;
            }
        } else {
            alert(`Error with json file adress: ${file}`);
        };
    }
};