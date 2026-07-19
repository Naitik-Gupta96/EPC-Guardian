BLAST_RADIUS_QUERY = """
MATCH (d:Deviation)-[:VIOLATES]->(:Requirement)-[:SPECIFIES]->(e:Equipment)
MATCH (e)-[:PROCURED_VIA]->(po:PurchaseOrder)-[:DELIVERS_TO]->(m:Milestone)
MATCH (m)-[:GATES]->(a:Activity)-[:VALIDATED_BY]->(t:Test)
WHERE d.id = $deviation_id
RETURN e, po, m, a, t
"""
