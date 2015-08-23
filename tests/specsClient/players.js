describe('Players class', function() {
    describe('Player', function() {

        it('create', function() {
            var player = new Player(game);
            expect(player._id).toBeDefined();
            expect(player._id.length).toBe(10);
            console.log(player._id)
            expect(player.name).toBe("");
            expect(player.tyranosaur).toBeNull();
        });

        it('init from server', function() {
            var sPlayer = {
                _id: 1,
                name: "bob"
            };
            var player = new Player(game);
            player.initFromServer(sPlayer);

            expect(player._id).toBe(1);
            expect(player.name).toBe("bob");
            expect(player.tyranosaur).toBeDefined();
            expect(player.tyranosaur instanceof Tyranosaur).toBeTruthy();
        });
    });

    describe('Players', function() {

        var players;
        beforeEach(function() {
            players = new Players(game);
        });

        it('create', function() {
            var player = players.new();
            expect(player).toBeDefined();
            expect(player instanceof Player).toBeTruthy();
        });

        it('get by id', function() {

            var player = players.new();

            expect(players.getById(player._id)).toBe(player);

        });

        it('get all', function() {
            expect(players.getAll().length).toBe(0);

            players.new();
            expect(players.getAll().length).toBe(1);
            players.new();
            expect(players.getAll().length).toBe(2);

        });

        it('delete from player', function() {
            expect(players.getAll().length).toBe(0);
            var player = players.new();
            expect(players.getAll().length).toBe(1);
            players.delete(player);
            expect(players.getAll().length).toBe(0);
        });

        it('delete from id', function() {
            expect(players.getAll().length).toBe(0);
            var player = players.new();
            expect(players.getAll().length).toBe(1);
            players.delete(player._id);
            expect(players.getAll().length).toBe(0);
        });
    });
});
