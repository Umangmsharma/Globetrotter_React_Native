#include <stdio.h>
#include "file.h"
#include <stdio.h>
#include <sys/socket.h>
#include <stdlib.h>
#include <netinet/in.h>
#include <netdb.h>
#include <fcntl.h>  // for open
#include <unistd.h> // for close
#include <arpa/inet.h>
#include <string.h>
#include <pthread.h>
#define PACKET_SIZE 256
#define DATA_SIZE 244

//const char strOkAckRudp[] = "okay";
const char eof[] = "rishabh";
typedef struct
{
  int sequenceNo;
  int packetSize;
  int checkSum;
} packet_header;



//server     ./netster -r 1 -f recv.txt -p 1234
//client      ./netster -r 1 -f test3.txt -p 1234 127.0.0.1    // big data
// ./netster -r 1 -f test1.txt -p 1234 127.0.0.1    //small data

/*
 *  Here is the starting point for your netster part.3 definitions. Add the 
 *  appropriate comment header as defined in the code formatting guidelines
 */

//Server side - read data sent by client and WRITE it to file (UDP)
void write_file_rudp(int sockfdserver, FILE *fp, struct sockaddr_in clientAddrserver)
{
  int n;
  int len = sizeof(clientAddrserver);
  int lastPacketNo = 0;
  char buffer[PACKET_SIZE];
  char data[DATA_SIZE];
  
  packet_header o_packet_header_server;
  while (1)
  {
    bzero(buffer, PACKET_SIZE);
    bzero(data, DATA_SIZE);
    n = recvfrom(sockfdserver, buffer, PACKET_SIZE, 0, (struct sockaddr *)&clientAddrserver, (socklen_t *)&len);
    if (n <= 0)
    {
      break;
      return;
    }
    //printf("\n entire packet%lu", sizeof(buffer));
    //Copy data from stream to respective arrays
    memcpy(&o_packet_header_server, buffer, sizeof(o_packet_header_server));
    memcpy(&data, buffer + sizeof(o_packet_header_server), o_packet_header_server.packetSize);
    //printf("\nPacket no %d", o_packet_header_server.sequenceNo);
    // printf("\nPacket checkSum %d", o_packet_header_server.checkSum);
    // printf("\nPacket packetAck %d", o_packet_header_server.packetAck);
    //printf("\nPackets data size receieved  %d", o_packet_header_server.packetSize);
    //printf("\nPacket data %s", data);
    // printf("\ndata length %lu", strlen(data));
    //if (strcmp(data, "rishabh") == 0){
    // -1 is the last packet used as delimiter
    if(o_packet_header_server.sequenceNo == -10) {
      bzero(buffer, PACKET_SIZE);
      bzero(data, DATA_SIZE);
      sendto(sockfdserver, &o_packet_header_server.sequenceNo, sizeof(o_packet_header_server.sequenceNo),
           0, (const struct sockaddr *)&clientAddrserver,
           len);
      bzero(buffer, PACKET_SIZE);
      bzero(data, DATA_SIZE); 
      fclose(fp);
      close(sockfdserver);
      exit(0);
    }
    printf("\n%d Last Packet %d current packet", lastPacketNo, o_packet_header_server.sequenceNo);
    //To avoid multiple write operation for duplicate packet
    if((lastPacketNo + 1) == o_packet_header_server.sequenceNo){
        //printf("\nDIFF PACKET");
        fwrite(data, 1, o_packet_header_server.packetSize, fp);
        //fwrite(data, 1, sizeof(data), fp);
        lastPacketNo = o_packet_header_server.sequenceNo;
    } else {
      printf("\nSAME PACKET");
    }
    
    bzero(buffer, PACKET_SIZE);
    bzero(data, DATA_SIZE);

    //printf("%d", &o_packet_header_server.sequenceNo);
    sendto(sockfdserver, &o_packet_header_server.sequenceNo, sizeof(o_packet_header_server.sequenceNo),
           0, (const struct sockaddr *)&clientAddrserver,
           len);
    bzero(buffer, PACKET_SIZE);
    bzero(data, DATA_SIZE);
  }

  return;
}

//Client side - read data and send across the socket to the server (UDP)
void send_file_rudp(FILE *fp, int sockfd, struct sockaddr_in serverAddr)
{
  char buffer[PACKET_SIZE];
  char data[DATA_SIZE];
  int sizeOfDataRead;
  int lenOfServerAddr = sizeof(serverAddr);
  int nPacketNo = 1;
  int nRecvData = -2;
  int nDelimiterPacketAck = -10;
  
  struct timeval tv;
  tv.tv_sec = 0;  /* 30 Secs Timeout */
  tv.tv_usec = 600;
  bzero(buffer, PACKET_SIZE);
  bzero(data, DATA_SIZE);

  //set socket timeout to 1 sec
  setsockopt(sockfd, SOL_SOCKET, SO_RCVTIMEO,&tv,sizeof(tv));
  
  while ((sizeOfDataRead = fread(data, 1, DATA_SIZE - 1, fp)) > 0)
  {
    
    // Initialize a header
    packet_header o_packet_header = {
        .sequenceNo = nPacketNo,
        .packetSize = sizeOfDataRead,
        .checkSum = 123123123};
     //printf("\nPackets data size sent  %d", o_packet_header.packetSize);
    memcpy(buffer, &o_packet_header, sizeof(o_packet_header));
    memcpy(buffer + sizeof(o_packet_header), &data, sizeOfDataRead);

    //GOTO LABEL in case of packet failure and timeout restart from here
    sendAgain:
    //printf("PACKET NO sent %d \n", nPacketNo);
    if (sendto(sockfd, buffer, sizeof(buffer), 0, (const struct sockaddr *)&serverAddr, (socklen_t)lenOfServerAddr) == -1)
    {
      perror("[-]Error in sending file.");
      exit(1);
    }
    
     
    if(recvfrom(sockfd, &nRecvData, sizeof(nRecvData), 0, (struct sockaddr *)&serverAddr, (socklen_t *)&lenOfServerAddr) > 0) {
      //printf("\ninside");
      //printf("\n Packet no recv %d\n", nRecvData);

      //RECEIVED DATA error send int or string from server and receive same datatype
      //todo add sequence number check/ack check if fails then send packet again and add timeout
      //if (strcmp(recvData, "okay") == 0)
      if (nRecvData == nPacketNo)
      {
        bzero(buffer, PACKET_SIZE);
        bzero(data, DATA_SIZE);
        //bzero(recvData, PACKET_SIZE);
        //printf("\ninside if ack receivbed");
        //break;
      } else {
        //bzero(recvData, PACKET_SIZE);
        //printf("\nSend packet again worng packet ack %d\n", nPacketNo);
        goto sendAgain;
      }
    } else {
      //printf("\nTime out send packet again %d\n", nPacketNo);
      goto sendAgain;
    }

    bzero(buffer, PACKET_SIZE);
    bzero(data, DATA_SIZE);
    //bzero(recvData, PACKET_SIZE);

    nPacketNo++;
  }

  bzero(buffer, PACKET_SIZE);
  bzero(data, DATA_SIZE);

  memcpy(data, &eof, sizeof(eof));
  packet_header o_packet_header = {
      .sequenceNo = nDelimiterPacketAck,
      .packetSize = sizeof(eof),
      .checkSum = 14
      };

  memcpy(buffer, &o_packet_header, sizeof(o_packet_header));
  memcpy(buffer + sizeof(o_packet_header), &data, sizeof(eof));
  int noOfTimesToSendDelimiterPacket = 10;
  while(1){
    sendto(sockfd, buffer, sizeof(buffer), 0, (const struct sockaddr *)&serverAddr, (socklen_t)lenOfServerAddr);
    recvfrom(sockfd, &nRecvData, sizeof(nRecvData), 0, (struct sockaddr *)&serverAddr, (socklen_t *)&lenOfServerAddr);
    if(nRecvData == nDelimiterPacketAck || noOfTimesToSendDelimiterPacket == 0) {
      break;
    }
    noOfTimesToSendDelimiterPacket--;
  }
  bzero(buffer, PACKET_SIZE);
  bzero(data, DATA_SIZE);
}

/* Add function definitions */
void stopandwait_server(char *iface, long port, FILE *fp)
{
  int server_fd;

  struct sockaddr_in sin;

  server_fd = socket(AF_INET, SOCK_DGRAM, 0);

  //Create socket
  if (server_fd == 0)
  {
    perror("socket failed");
    exit(EXIT_FAILURE);
  }

  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = INADDR_ANY;
  sin.sin_port = htons(port);
  setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &(int){1}, sizeof(int));
  //Bind with port
  if (bind(server_fd, (struct sockaddr *)&sin,
           sizeof(sin)) < 0)
  {
    perror("bind");
    printf("Cannot bind server application to network\n");
    abort();
  }

  write_file_rudp(server_fd, fp, sin);
  close(server_fd);
}

void stopandwait_client(char *host, long port, FILE *fp)
{
  //printf("%s \n",host);
  struct sockaddr_in sin;
  int sock = 0;

  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  //sin.sin_addr.s_addr = INADDR_ANY;
  sin.sin_addr.s_addr = inet_addr(host);
  sin.sin_port = htons(port);

  sock = socket(AF_INET, SOCK_DGRAM, 0);

  send_file_rudp(fp, sock, sin);

  close(sock);
  exit(0);
}
