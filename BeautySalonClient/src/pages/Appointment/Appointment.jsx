import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Appointment.module.css';
import { nodes, getNodeById, getNextNode, getPreviousNode } from './nodes';
import { useAuth } from '../../hooks/useAuth';

// Компоненты для каждого шага
import ServiceSelection from './steps/ServiceSelection';
import DateMasterSelection from './steps/DateMasterSelection';
import Confirmation from './steps/Confirmation';

export function Appointment() {
    const navigate = useNavigate();
    const currentUser = useAuth();
    const [currentNode, setCurrentNode] = useState(nodes[0]);
    const [appointmentData, setAppointmentData] = useState({
        services: [],
        masterId: null,
        date: null,
        time: null
    });

    // useEffect(() => {
    //     if (!currentUser.isAuth) {
    //         navigate('/login');
    //         return;
    //     }
    // }, [currentUser, navigate]);

    const handleNext = (data) => {
        setAppointmentData(prev => ({
            ...prev,
            ...data
        }));
        const nextNode = getNextNode(currentNode.id);
        if (nextNode) {
            setCurrentNode(nextNode);
        }
    };

    const handlePrev = () => {
        const prevNode = getPreviousNode(currentNode.id);
        if (prevNode) {
            setCurrentNode(prevNode);
        }
    };

    const renderStep = () => {
        switch (currentNode.id) {
            case 1:
                return (
                    <ServiceSelection
                        onNext={handleNext}
                        appointmentData={appointmentData}
                    />
                );
            case 2:
                return (
                    <DateMasterSelection
                        onNext={handleNext}
                        onPrev={handlePrev}
                        appointmentData={appointmentData}
                    />
                );
            case 3:
                return (
                    <Confirmation
                        onPrev={handlePrev}
                        appointmentData={appointmentData}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.appointment}>
            <div className="container">
                <div className={styles.appointment_inner}>
                    <div className={styles.steps}>
                        {nodes.map((node, index) => (
                            <div 
                                key={node.id} 
                                className={`${styles.step_item} ${node.id === currentNode.id ? styles.active : ''} ${
                                    node.id < currentNode.id ? styles.completed : ''
                                }`}
                            >
                                <div className={styles.step_number}>{index + 1}</div>
                                <div className={styles.step_content}>
                                    <h3>{node.title}</h3>
                                    <p>{node.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.content_area}>
                        {renderStep()}
                    </div>
                </div>
            </div>
        </div>
    );
}
