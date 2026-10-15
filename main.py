import decky


class Plugin:
    async def _main(self):
        decky.logger.info("Void Deck cargado")

    async def _unload(self):
        decky.logger.info("Void Deck descargado")
