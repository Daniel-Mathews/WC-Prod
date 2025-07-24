FROM debezium/connect:2.6

USER root

# Create plugin directory if not exists
RUN mkdir -p /kafka/connect/plugins/kafka-connect-jdbc

# ✅ Install Kafka Connect JDBC Connector
RUN curl -sSL -o /kafka/connect/plugins/kafka-connect-jdbc/kafka-connect-jdbc.jar \
    https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/10.7.4/kafka-connect-jdbc-10.7.4.jar

# ✅ Install PostgreSQL JDBC Driver (This was missing!)
RUN curl -sSL -o /kafka/connect/plugins/kafka-connect-jdbc/postgresql-42.7.2.jar \
    https://repo1.maven.org/maven2/org/postgresql/postgresql/42.7.2/postgresql-42.7.2.jar

# ✅ Debezium PostgreSQL Connector
RUN mkdir -p /kafka/connect/plugins/debezium-connector-postgres && \
    curl -sSL -o /kafka/connect/plugins/debezium-connector-postgres/debezium-connector-postgres-2.6.1.Final-plugin.tar.gz \
    https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgres/2.6.1.Final/debezium-connector-postgres-2.6.1.Final-plugin.tar.gz && \
    tar -xzf /kafka/connect/plugins/debezium-connector-postgres/debezium-connector-postgres-2.6.1.Final-plugin.tar.gz -C /kafka/connect/plugins/debezium-connector-postgres --strip-components=1 && \
    rm /kafka/connect/plugins/debezium-connector-postgres/*.tar.gz

USER kafka
