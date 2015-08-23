describe('Players class', function() {
    describe('Player', function() {

        it('create', function() {
            var player = new Player(game);
            expect(player._id).toBe("");
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
            expect(player.tyranosaur).not.toBeNull();
        });
    });
});
