FROM debezium/connect:2.6

USER root

# Install curl (because base image uses micro Alpine, no apt-get)
RUN microdnf install -y curl bash && \
    mkdir -p /kafka/connect/plugins/kafka-connect-jdbc && \
    curl -sSL -o /kafka/connect/plugins/kafka-connect-jdbc/kafka-connect-jdbc.jar \
    https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/10.7.4/kafka-connect-jdbc-10.7.4.jar && \
    microdnf clean all

# Copy connector registration and wrapper script
COPY register-connectors.sh /kafka/register-connectors.sh
COPY entrypoint.sh /kafka/entrypoint.sh

RUN chmod +x /kafka/register-connectors.sh /kafka/entrypoint.sh

USER kafka

# Use our custom entrypoint to launch Connect and register connectors
ENTRYPOINT ["/kafka/entrypoint.sh"]
