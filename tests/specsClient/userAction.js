var userInput, fakeDom, userAction;

var FakeDom = function() {

};

FakeDom.prototype.addEventListener = function() {

};

describe('UserAction', function() {

    beforeEach(function() {
        fakeDom = new FakeDom();
        userInput = new UserInput(fakeDom);
        var game = {userInput: userInput};
        userAction = new UserAction(game);
    });

    it('create', function() {

        expect(userAction instanceof UserAction).toBeTruthy();
        expect(userAction.userInput).toBe(userInput);
        expect(userAction.actions).toBeDefined();
    });

    it('updateActions', function() {
        userInput.KEYS['UP'].active = true;
        userInput.KEYS['UP'].eventTimestamp = Date.now();

        expect(userAction.actions['MOVE'].active).toBeFalsy();

        userAction.updateActions();

        expect(userAction.actions['MOVE'].active).toBeTruthy();
        expect(userAction.actions['MOVE'].value).toBe('UP');
    });

    it('updateActions 2', function() {
        userInput.KEYS['DOWN'].active = true;
        userInput.KEYS['DOWN'].eventTimestamp = Date.now();

        expect(userAction.actions['MOVE'].active).toBeFalsy();

        userAction.updateActions();

        expect(userAction.actions['MOVE'].active).toBeTruthy();
        expect(userAction.actions['MOVE'].value).toBe('DOWN');
    });

    it('updateActions 3', function() {
        userInput.KEYS['POO'].active = true;
        userInput.KEYS['POO'].eventTimestamp = Date.now();

        expect(userAction.actions['POO'].active).toBeFalsy();

        userAction.updateActions();

        expect(userAction.actions['POO'].active).toBeTruthy();
        expect(userAction.actions['POO'].value).toBe('POO');
    });

    it('updateActions multi', function() {
        userInput.KEYS['DOWN'].active = true;
        userInput.KEYS['DOWN'].eventTimestamp = Date.now();

        userInput.KEYS['UP'].active = true;
        userInput.KEYS['UP'].eventTimestamp = Date.now();

        expect(userAction.actions['MOVE'].active).toBeFalsy();

        userAction.updateActions();

        expect(userAction.actions['MOVE'].active).toBeTruthy();
        expect(userAction.actions['MOVE'].value).toBe('UP');
    });

    it('updateActions multi 2', function(done) {
        userInput.KEYS['UP'].active = true;
        userInput.KEYS['UP'].eventTimestamp = Date.now();

        setTimeout(function() {

            userInput.KEYS['DOWN'].active = true;
            userInput.KEYS['DOWN'].eventTimestamp = Date.now();

            expect(userAction.actions['MOVE'].active).toBeFalsy();

            userAction.updateActions();

            expect(userAction.actions['MOVE'].active).toBeTruthy();
            expect(userAction.actions['MOVE'].value).toBe('DOWN');

            done();
        }, 1);
    });

    it('registerListener', function() {

        var listener = function() {
        };

        userAction.registerListener('MOVE', listener);

        expect(userAction.actions['MOVE'].listeners).toBeDefined();
        expect(userAction.actions['MOVE'].listeners.length).toBe(1);
        expect(userAction.actions['MOVE'].listeners[0]).toBe(listener);
    });

    it('runListeners', function(done) {

        var listener = function(value, pressed) {
            expect(value).toBe('UP');
            expect(pressed).toBeTruthy();
            done();
        };

        userAction.actions['MOVE'].value = 'UP';
        userAction.registerListener('MOVE', listener);
        userAction.runListeners('MOVE', true);
    });

    it('runListeners2', function(done) {

        var listener = function(value, pressed) {
            expect(value).toBe('DOWN');
            expect(pressed).toBeFalsy();
            done();
        };

        userAction.actions['MOVE'].value = 'DOWN';
        userAction.registerListener('MOVE', listener);
        userAction.runListeners('MOVE', false);
    });

});
