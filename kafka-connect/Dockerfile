FROM debezium/connect:2.6

USER root
RUN curl -sO https://packages.confluent.io/maven/io/confluent/kafka-connect-jdbc/10.7.4/kafka-connect-jdbc-10.7.4.jar && \
    mv kafka-connect-jdbc-10.7.4.jar /kafka/connectors/

USER kafka
