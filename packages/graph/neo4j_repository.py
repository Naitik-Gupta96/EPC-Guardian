from packages.graph.interface import ImpactGraphRepository, ImpactGraph, ImpactGraphNode, ImpactGraphEdge


class Neo4jImpactGraphRepository(ImpactGraphRepository):
    def __init__(self, uri: str, user: str, password: str):
        self._uri = uri
        self._user = user
        self._password = password
        self._driver = None

    async def _get_driver(self):
        if self._driver is None:
            from neo4j import AsyncGraphDatabase
            self._driver = AsyncGraphDatabase.driver(self._uri, auth=(self._user, self._password))
        return self._driver

    async def rebuild_project(self, project_id: str) -> None:
        driver = await self._get_driver()
        async with driver.session() as session:
            await session.run("MATCH (n) DETACH DELETE n")

    async def upsert_deviation(self, deviation_id: str) -> None:
        pass

    async def get_blast_radius(self, deviation_id: str) -> ImpactGraph:
        driver = await self._get_driver()
        async with driver.session() as session:
            result = await session.run(
                """
                MATCH (d:Deviation)-[:VIOLATES]->(:Requirement)-[:SPECIFIES]->(e:Equipment)
                MATCH (e)-[:PROCURED_VIA]->(po:PurchaseOrder)-[:DELIVERS_TO]->(m:Milestone)
                MATCH (m)-[:GATES]->(a:Activity)-[:VALIDATED_BY]->(t:Test)
                WHERE d.id = $deviation_id
                RETURN e, po, m, a, t
                """,
                deviation_id=deviation_id,
            )
            nodes = []
            edges = []
            async for record in result:
                pass
            return ImpactGraph(deviation_id=deviation_id, nodes=nodes, edges=edges)
