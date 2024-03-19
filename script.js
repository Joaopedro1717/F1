const button = document.getElementById('start');

button.addEventListener("click", async (e) => {
    await Bet.start();
});

const Track = (function() {
    const track = document.getElementById("track");
    const track_rect = track.getBoundingClientRect();

    function getStart() {
        return track_rect.left;
    }

    function getEnd() {
        return track_rect.right;
    }

    return {
        getStart: getStart,
        getEnd: getEnd
    }
})();

const Game = (function() {

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const cars = [
        document.getElementById('car-1'),
        document.getElementById('car-2'),
        document.getElementById('car-3'),
        document.getElementById('car-4'),
        document.getElementById('car-5'),
    ];

    async function start() {
        
        resetCars();

        let winnerId;

        while (true) {
            doTurn();
            winnerId = checkWinner();
            
            if (winnerId) {
                break;
            }
            await sleep(50);
        }

        const winner = document.getElementById(winnerId);
        alert(winnerId);
        
        resetCars();

        return winnerId;
    };

    function resetCars() {
        for (let i = 0; i < cars.length; i++) {
            cars[i].style.left = `${Track.getStart()}px`;
        }
    }

    function doTurn() {
        for (let i = 0; i < cars.length; i++) {
            Engine.run(cars[i].id);
        }
    }

    function checkWinner() {
        let maxDistance = 0;
        let maxId = '';

        for (let i = 0; i < cars.length; i++) {
            const carPosition = parseInt(cars[i].style.left, 10);
            if (carPosition > maxDistance) {
                maxDistance = carPosition;
                maxId = cars[i].id;
            }
        }

        if (maxDistance > END_LINE) {
            return maxId;
        }

        return null;
    }

    return {
        start: start
    }


})();

const START_LINE = Track.getStart();
const END_LINE = Track.getEnd();

const Engine = (function(start_line, end_line) {

    function caclNewPos(car) {
        const min_pos = 5;
        const max_pos = 20;

        const style = window.getComputedStyle(car);
        const original_pos = parseInt(style.getPropertyValue("left"), 10);

        return original_pos + Math.floor(Math.random() * (max_pos - min_pos + 1) + min_pos);
    }

    function travel(car_id) {
        const car = document.getElementById(car_id);
        const new_pos = caclNewPos(car);
        car.style.left = `${new_pos}px`;
    }

    return {
        run: travel
    }


})(START_LINE, END_LINE);

let money = 100;

const Bet = (function() {
    async function onStart(e) {
        const car_number = document.getElementById('car-input').value;
        const bet_value = document.getElementById('bet-value').value;

        if (!bet_value || !car_number) {
            return;
        }

        if (parseInt(car_number, 10) > 5 || bet_value > money) {
            alert('insira um número de 1 a 5');
            return;
        }

        if (parseInt(bet_value, 10) < 5) {
            alert("Aposte ao menos 5$");
            return;
        }

        const carId = await Game.start();
        if (carId == `car-${car_number}`) {
            money += bet_value * 2
        } else {
            money -= bet_value;
        }

        document.getElementById('money').innerHTML = `Cash: R$${money}`

        if (money == 0) {
            alert("Derrota!!");
            window.location.href = ''
        }
    }

    return {
        start: onStart
    }
})()