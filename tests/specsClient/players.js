describe('Players class', function() {
    describe('Player', function() {

        it('create', function() {
            var player = new Player(game);
            expect(player._id).toBeDefined();
            expect(player._id.length).toBe(10);
            expect(player.name).toBe("");
            expect(player.tyranosaur).toBeNull();
        });

        it('init', function() {
            var player = new Player(game);

            player.init();
            expect(player.tyranosaur).toBeDefined();
            expect(player.tyranosaur instanceof Tyranosaur).toBeTruthy();
        });

        it('update from server', function() {

            var sPlayer = {
                _id: 1,
                name: "bob",
                tyranosaur: {
                    position: [1,2,3],
                    rotation: [1,2,3, 'zyx']
                }
            };

            var player = new Player(game);
            player.init();
            player.updateFromServer(sPlayer);

            expect(player._id).toBe(1);
            expect(player.name).toBe("bob");

            var position = player.tyranosaur.getObject().position;
            var rotation = player.tyranosaur.getObject().rotation;
            expect(position.x).toBe(1);
            expect(position.y).toBe(2);
            expect(position.z).toBe(3);
            expect(rotation.x).toBe(1);
            expect(rotation.y).toBe(2);
            expect(rotation.z).toBe(3);
            expect(rotation.order).toBe('zyx');
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
