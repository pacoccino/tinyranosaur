var userInput, fakeDom;

var FakeDom = function() {

};

var ZEventCode = 90;

FakeDom.prototype.addEventListener = function() {

};

describe('UserInput', function() {

    beforeEach(function() {
        fakeDom = new FakeDom();
        userInput = new UserInput(fakeDom);
    });

    it('create', function() {

    });

    it('convertKeyToCharCode', function() {
        var charcode = UserInput.convertKeyToCharCode('Z');
        expect(charcode).toBe(ZEventCode);

        charcode = UserInput.convertKeyToCharCode('D');
        expect(charcode).toBe(68);
    });

    it('isSameCode', function() {
        var eventCode = ZEventCode;
        var keyCode;

        keyCode = ZEventCode;
        expect(UserInput.isSameCode(eventCode, keyCode)).toBeTruthy();

        keyCode = 'Z';
        expect(UserInput.isSameCode(eventCode, keyCode)).toBeTruthy();

        keyCode = 'A';
        expect(UserInput.isSameCode(eventCode, keyCode)).toBeFalsy();

        keyCode = ZEventCode+1;
        expect(UserInput.isSameCode(eventCode, keyCode)).toBeFalsy();
    });

    it('parseKeyCode UP', function() {
        var eventCode = ZEventCode;
        var action = userInput.KEYS['UP'];
        var otherAction = userInput.KEYS['DOWN'];

        expect(action.active).toBeFalsy();
        expect(otherAction.active).toBeFalsy();

        userInput.parseEventCode(eventCode, 'DOWN');

        expect(action.active).toBeTruthy();
        expect(otherAction.active).toBeFalsy();
    });

    it('parseKeyCode DOWN', function() {
        var eventCode = ZEventCode;
        var action = userInput.KEYS['UP'];

        expect(action.active).toBeFalsy();

        userInput.parseEventCode(eventCode, 'DOWN');
        expect(action.active).toBeTruthy();
        userInput.parseEventCode(eventCode, 'UP');
        expect(action.active).toBeFalsy();
    });


    it('parseKeyCode UP', function() {
        var eventCode = ZEventCode;
        var action = userInput.KEYS['UP'];
        var otherAction = userInput.KEYS['DOWN'];

        userInput.parseEventCode(eventCode, 'DOWN');
        expect(action.active).toBeTruthy();

        userInput.dropKeys();
        expect(action.active).toBeFalsy();
    });

    // TODO : mouse move
});
